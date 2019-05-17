import { Component, ComponentRef } from '@angular/core';
import {
  IModalDialog,
  IModalDialogOptions,
  IModalDialogButton
} from 'ngx-modal-dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalService } from 'src/app/core/apiServices/global.service';
import { Observable, Subject, of } from 'rxjs';
import { AlertService } from 'src/app/core/apiServices/alert.service';
import { catchError, map, finalize, takeUntil, take } from 'rxjs/operators';
import { doActionForAllFormFields } from 'src/app/core/utils-services/utils';
import { DossiersService } from 'src/app/core/apiServices/dossiers.service';

@Component({
  templateUrl: 'export.component.html',
  styles: [
    `
      .is-invalid input {
        border: 1px solid red;
      }
      .is-invalid + .invalid-feedback {
        display: block;
      }
    `
  ]
})
export class ExportModalComponent implements IModalDialog {
  form: FormGroup;
  companies: any[];
  agents$: Observable<any[]>;
  isExporting: boolean;
  exportSuccess: boolean;
  fileData: any;
  fileName: string;
  internalActionButtons: IModalDialogButton[] = [];

  constructor(
    fb: FormBuilder,
    private globalService: GlobalService,
    private dossierService: DossiersService,
    private alertService: AlertService
  ) {
    this.form = fb.group({
      date_debut: [null, Validators.required],
      date_fin: [null, Validators.required],
      agtIds: [null, Validators.required],
      compagnieIds: [null, Validators.required]
    });
  }

  get f() {
    return this.form.controls;
  }

  dialogInit(
    reference: ComponentRef<IModalDialog>,
    options: Partial<IModalDialogOptions<any>>
  ) {
    options.actionButtons = this.internalActionButtons;
    this.internalActionButtons.push({
      buttonClass: 'btnAct',
      text: 'ANNULER',
      onAction: () => {
        return true;
      }
    });
    this.internalActionButtons.push({
      buttonClass: 'btnAct',
      text: 'EXPORTER',
      onAction: () => {
        doActionForAllFormFields(this.form, 'touch');
        if (this.form.invalid) {
          return;
        }
        this.isExporting = true;
        this.onAction();
      }
    });

    this.agents$ = this.dossierService
      .getAgtsWithMissionCounts()
      .pipe(map(agts => [{ id: 0, login: 'Tous les agents' }, ...agts]));
    this.globalService
      .getCompagnies()
      .pipe(take(1))
      .subscribe(companies => (this.companies = companies));
  }

  onAction() {
    this.internalActionButtons[0].buttonClass = 'd-none';
    this.internalActionButtons[1].buttonClass = 'd-none';

    this.dossierService
      .exportToExcel(
        this.f.date_debut.value,
        this.f.date_fin.value,
        this.f.agtIds.value,
        this.f.compagnieIds.value
      )
      .pipe(
        map((res: any) => {
          this.exportSuccess = true;

          if (navigator.appVersion.toString().indexOf('.NET') > 0) {
            // for IE browser
            window.navigator.msSaveBlob(
              res.data,
              res.fileName || 'Report.xlsx'
            );
          } else {
            // for chrome and firfox
            this.fileData = window.URL.createObjectURL(res.data);
            this.fileName = res.fileName || 'Report.xlsx';
          }
          this.internalActionButtons[0].text = 'FERMER';
          this.internalActionButtons[0].buttonClass = 'd-block btnAct';
        }),
        catchError(err => {
          console.log(err);

          if (err && err.error && err.error.statusCode === 201) {
            this.alertService.warn({
              msg: `${err.error.Title}: ${err.error.Message}`
            });
          } else {
            this.alertService.error({
              msg: err
                ? err.error
                  ? `${err.error.Title}: ${err.error.Message}`
                  : err.message
                : 'Une Erreur est servenue'
            });
          }
          this.isExporting = false;
          this.internalActionButtons[0].buttonClass = 'd-block btnAct';
          this.internalActionButtons[1].buttonClass = 'd-block btnAct';
          return of(err);
        }),
        finalize(() => {
          this.isExporting = false;
        })
      )
      .subscribe();
  }
}

export interface ExportModel {
  date_debut: Date;
  date_fin: Date;
  agtIds: number[];
  compagnieIds: number[];
  status: string;
}
