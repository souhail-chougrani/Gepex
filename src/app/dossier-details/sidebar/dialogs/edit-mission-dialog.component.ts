import {
  Component,
  ComponentRef,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil, map, catchError, finalize, tap } from 'rxjs/operators';
import { GlobalService } from 'src/app/core/apiServices/global.service';
import { DossierDetailsService } from 'src/app/core/apiServices/dossier-details.service';
import { AlertService } from 'src/app/core/apiServices/alert.service';
import { Subject, of } from 'rxjs';
import { DATE_FR } from 'src/app/core/models/Utils';

@Component({
  templateUrl: 'edit-mission-dialog.component.html',
  styles: [
    `
      :host /deep/ .ui-calendar {
        width: 100%;
      }
      i.blue {
        color: #147abd;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditMissionDialogComponent implements IModalDialog, AfterViewInit {
  fr = DATE_FR;
  missionForm: FormGroup;
  allMarks: any[];
  allMarkModels: any[];
  mission: any;
  formHasBeenInitialized = false;
  marksAreLoading: boolean;
  modelsAreLoading: boolean;
  internalActionButtons = [];
  cancel$ = new Subject<void>();
  isSubmitting: boolean;

  get f() {
    return this.missionForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private globalService: GlobalService,
    private changeDetectorRef: ChangeDetectorRef,
    private dossierDetailsService: DossierDetailsService,
    private alertService: AlertService
  ) {}

  dialogInit(
    reference: ComponentRef<IModalDialog>,
    options: Partial<IModalDialogOptions<any>>
  ) {
    this.mission = options.data.mission;
    // initialize mission form with validators;
    this.missionForm = this.fb.group({
      matricule: [this.mission.Matricule],
      marqueId: [null],
      modelId: [null],
      numChassi: [
        this.mission.NumChassi,
        Validators.pattern(/^(?=.*[0-9])(?=.*[A-z])[0-9A-Za-z]{17}$/gi)
      ],
      dateMEC: [new Date(this.mission.DateMEC)]
    });
    // create dialog buttons for add or update.
    options.actionButtons = this.internalActionButtons;
    this.internalActionButtons.push({
      buttonClass: 'btnAct',
      text: 'ANNULER',
      onAction: () => {
        this.cancel$.next();
        this.cancel$.complete();
        if (this.isSubmitting) {
          this.alertService.error({ msg: 'L\'opération est annuler.' });
        }
        return true;
      }
    });
    this.internalActionButtons.push({
      buttonClass: 'btnAct success',
      text: 'MODIFIER',
      onAction: () => {
        this.f.numChassi.markAsTouched();
        if (this.missionForm.invalid) {
          return;
        }
        this.isSubmitting = true;
        this.changeDetectorRef.detectChanges();
        return this.onAction({
          Matricule: this.f.matricule.value,
          MarqueID: this.f.marqueId.value,
          ModelID: this.f.modelId.value,
          NumChassi: this.f.numChassi.value,
          DateMEC: this.f.dateMEC.value
        });
      }
    });
  }

  onAction(updatedMission) {
    this.internalActionButtons.splice(1, 2);
    this.dossierDetailsService
      .updateMission(this.mission.id, updatedMission)
      .pipe(
        takeUntil(this.cancel$),
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

  ngAfterViewInit() {
    this.globalService
      .getMarques()
      .pipe(
        tap(() => (this.marksAreLoading = true)),
        map(marks => {
          this.allMarks = marks;
          if (this.mission.Marque) {
            const mark = this.allMarks.find(m =>
              m.libelle
                .toLowerCase()
                .includes(this.mission.Marque.toLowerCase())
            );
            this.f.marqueId.setValue(mark ? mark.id : null);
            this.handleSelectMark(mark);
          }
        }),
        catchError(err => {
          this.alertService.error({
            msg: err.error
              ? `${err.error.Title}. ${err.error.Message}`
              : err.message
          });
          this.marksAreLoading = false;
          this.changeDetectorRef.detectChanges();
          return of([]);
        }),
        finalize(() => {
          this.marksAreLoading = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  handleSelectMark(event: { id: number; libelle: string }, modelId?: number) {
    if (!event || !event.id) {
      return;
    }
    this.globalService
      .getModels(event.id)
      .pipe(
        tap(() => {
          this.allMarkModels = [];
          this.modelsAreLoading = true;
          this.changeDetectorRef.detectChanges();
        }),
        map(models => {
          this.allMarkModels = models;
          this.formHasBeenInitialized = true;
          if (modelId) {
            this.f.modelId.setValue(modelId);
            return;
          }
          if (this.mission.Model) {
            const model = this.allMarkModels.find(
              m =>
                m.libelle
                  .toLowerCase()
                  .indexOf(this.mission.Model.toLowerCase()) > -1
            );
            this.f.modelId.setValue(model ? model.id : null);
          }
        }),
        catchError(err => {
          this.alertService.error({
            msg: err.error
              ? `${err.error.Title}. ${err.error.Message}`
              : err.message
          });
          this.modelsAreLoading = false;
          this.changeDetectorRef.detectChanges();
          return of([]);
        }),
        finalize(() => {
          this.modelsAreLoading = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  fillDataFromVin() {
    this.globalService
      .getMarkAndModelByVin(this.f.numChassi.value)
      .pipe(
        map(data => {
          this.f.marqueId.setValue(data.id_marque);
          this.handleSelectMark(
            { id: data.id_marque, libelle: '' },
            data.id_model
          );
        }),
        catchError(err => {
          this.alertService.error({
            msg: err.error
              ? `${err.error.Title}. ${err.error.Message}`
              : err.message
          });
          return of([]);
        })
      )
      .subscribe();
  }
}
