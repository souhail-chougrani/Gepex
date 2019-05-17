import { compare } from 'src/app/core/models/Utils';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ComponentRef, EventEmitter, Component } from '@angular/core';

@Component({
  templateUrl: './change-prices.component.html',
  styles: [
    `
      .card.selected {
        background-color: #007bff;
        color: white;
      }
      label:before,
      label:after {
        opacity: 0;
      }
      .custom-control {
        padding: 0;
      }
      /deep/ .card-header {
        padding: 0;
      }
      /deep/ .card-header button {
        padding: 1rem;
        color: #333;
        width: 100%;
      }
      /deep/ .card-header button:hover,
      /deep/ .card-header button:focus {
        color: #333;
        text-decoration: none;
        background-color: #eee;
      }
    `
  ]
})
export class ChangePricesModalComponent implements IModalDialog {
  onAction: EventEmitter<ChangingPriceItem>;
  editForm: FormGroup;
  submitted: boolean;
  activeIds = ['2'];
  article;

  constructor(private formBuilder: FormBuilder) {}

  dialogInit(
    reference: ComponentRef<IModalDialog>,
    options: Partial<IModalDialogOptions<any>>
  ) {
    options.actionButtons = [
      {
        text: 'ANNULER',
        buttonClass: 'btnAct',
        onAction: () => true
      },
      {
        text: 'MODIFIER',
        buttonClass: 'btnAct',
        onAction: () => this.setPrice()
      }
    ];
    this.article = options.data.article;
    this.onAction = options.data.onAction;
    this.editForm = this.formBuilder.group({
      manuelGroup: this.formBuilder.group({
        price: ['', [Validators.required, Validators.min(0)]],
        qte: ['', [Validators.required, Validators.min(0)]],
        type: ['', Validators.required]
      }),
      choicesGroup: this.formBuilder.group({
        choice: ['', Validators.required]
      })
    });
  }

  // ====== need in html =====
  get choices() {
    return this.choicesGroup.controls;
  }

  get manuel() {
    return this.manuelGroup.controls;
  }
  // =========================

  get choicesGroup() {
    return <FormGroup>this.editForm.controls.choicesGroup;
  }

  get manuelGroup() {
    return <FormGroup>this.editForm.controls.manuelGroup;
  }

  setPrice() {
    this.submitted = true;
    if (
      (this.activeIds.includes('2') && this.choicesGroup.invalid) ||
      (this.activeIds.includes('1') && this.manuelGroup.invalid)
    ) {
      return;
    }
    const value: ChangingPriceItem = this.activeIds.includes('2')
      ? {
          ...this.choices.choice.value,
          ArticleID: this.article.ArticleID,
          MontantHT:
            this.choices.choice.value.PrixHT *
            this.choices.choice.value.QteDemande,
          Remise: this.choices.choice.value.Remise
        }
      : {
          ArticleID: this.article.ArticleID,
          PrixHT: this.manuel.price.value,
          TypeArticle: this.manuel.type.value,
          QteDemande: this.manuel.qte.value,
          MontantHT: this.manuel.price.value * this.manuel.qte.value,
          Remise: 0
        };
    // reduce API calling
    if (
      compare(this.article, {
        ...this.article,
        TypeArticle: value.TypeArticle,
        PrixHT: value.PrixHT,
        QteDemande: value.QteDemande
      })
    ) {
      return true;
    }
    this.onAction.emit(value);
    return true;
  }
  onPanelChanged() {
    // Next line used to get selected ngb-accordian panel change event fired right before the panel toggle happens.
    this.activeIds = this.activeIds.includes('1') ? ['2'] : ['1'];
    this.submitted = false;
    if (this.activeIds.includes('1')) {
      this.manuelGroup.reset();
    } else {
      // we must not reset or set his value to null or the choices group will disappear.
      this.choices.choice.setValue('');
    }
  }
}

export interface ChangingPriceItem {
  ArticleID?: string;
  PrixHT?: number;
  TypeArticle?: string;
  QteDemande?: number;
  MontantHT?: number;
  Remise?: number;
  CotationLigneID: number;
}
