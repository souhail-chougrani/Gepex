import { Component, ComponentRef } from '@angular/core';
import {
  IModalDialog,
  IModalDialogOptions,
  IModalDialogButton
} from 'ngx-modal-dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalService } from 'src/app/core/apiServices/global.service';
import { Observable, Subject, of } from 'rxjs';
import { DossierDetailsService } from 'src/app/core/apiServices/dossier-details.service';
import { AlertService } from 'src/app/core/apiServices/alert.service';
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  catchError,
  switchMap,
  map,
  finalize,
  takeUntil
} from 'rxjs/operators';

@Component({
  template: `
    <ng-container *ngIf="!isSubmitting; else: loading">
      <form [formGroup]="form">
        <div>La valeur actuelle: <b>{{ currentDesignation }}</b></div>
        <br />
        <div>tapez une désignation pour chercher:</div>
        <br />
        <ng-select
          [items]="articles$ | async"
          placeholder="tapez une désignation..."
          bindLabel="designation"
          bindValue="id"
          [typeahead]="search$"
          [loading]="searchLoading"
          formControlName="designation"
        >
        </ng-select>
      </form>
    </ng-container>
    <ng-template #loading>
      <div class="d-flex align-items-center justify-content-center">
        <div class="spinner size24"></div>
        <span class="ml-2">modification...</span>
      </div>
    </ng-template>
  `
})
export class EditDesignationModalComponent implements IModalDialog {
  form: FormGroup;
  articles$: Observable<any[]>;
  isSubmitting: boolean;
  search$ = new Subject<string>();
  searchLoading: boolean;
  currentDesignation: string;
  internalActionButtons: IModalDialogButton[] = [];
  cancel$ = new Subject<void>();

  constructor(
    fb: FormBuilder,
    private globalService: GlobalService,
    private dossierDetailService: DossierDetailsService,
    private alertService: AlertService
  ) {
    this.form = fb.group({
      designation: [null, Validators.required]
    });
  }

  get designation() {
    return this.form.controls.designation;
  }

  dialogInit(
    reference: ComponentRef<IModalDialog>,
    options: Partial<IModalDialogOptions<any>>
  ) {
    this.currentDesignation = options.data.designation;
    options.actionButtons = this.internalActionButtons;
    this.internalActionButtons.push({
      buttonClass: 'btnAct',
      text: 'ANNULER',
      onAction: () => {
        this.cancel$.next();
        this.cancel$.complete();
        return true;
      }
    });
    this.internalActionButtons.push({
      buttonClass: 'btnAct',
      text: 'MODIFIER',
      onAction: () => {
        this.designation.markAsTouched();
        if (this.designation.invalid) {
          return;
        }
        this.isSubmitting = true;
        return this.onAction(
          options.data.fonction,
          options.data.misionId,
          options.data.cotationEnteteId,
          options.data.articleId
        );
      }
    });
    this.search$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.searchLoading = true)),
        switchMap(
          term =>
            (this.articles$ = this.globalService
              .getArticlesByDesignation(term)
              .pipe(
                catchError(() => of([])),
                tap(() => (this.searchLoading = false))
              ))
        )
      )
      .subscribe();
  }

  onAction(fonction, misionId, cotationEnteteId, articleId) {
    this.internalActionButtons.splice(1, 2);
    this.dossierDetailService
      .updateMissionArticleDesignation(
        fonction,
        misionId,
        cotationEnteteId,
        articleId,
        this.designation.value
      )
      .pipe(
        takeUntil(this.cancel$),
        map(success =>
          this.alertService.success({
            msg: success || 'L\'operation est effectuée avec succée.'
          })
        ),
        catchError(err => {
          this.alertService.error({
            msg: err.error
              ? `${err.error.Title}. ${err.error.Message}`
              : err.message
          });
          this.isSubmitting = false;
          return of(err);
        }),
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe(_ =>
        (<HTMLButtonElement>(
          document.querySelector('.modal-footer').children[0]
        )).click()
      );
  }
}
