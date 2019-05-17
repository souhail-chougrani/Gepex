import { Component, ComponentRef, EventEmitter, OnDestroy } from '@angular/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { NgxGalleryImage } from 'ngx-gallery';
import { DossierDetailsService } from 'src/app/core/apiServices/dossier-details.service';

@Component({
  templateUrl: './offres.component.html',
  styles: [
    `
      :host /deep/ .table thead th {
        background-color: #ffffff;
        top: -1px !important;
        box-shadow: 4px 3px 12px 0px #dee2e6;
      }
    `
  ]
})
export class OffresModalComponent implements IModalDialog, OnDestroy {
  
  offers: Offer[];
  onAction = new EventEmitter<NgxGalleryImage[]>();
  isLoading: boolean;
  error: string;

  constructor(private dossierDetailsService: DossierDetailsService) {}

  dialogInit(
    reference: ComponentRef<IModalDialog>,
    options: Partial<IModalDialogOptions<any>>
  ) {
    this.onAction = options.data.onAction;
    this.isLoading = true;
    this.dossierDetailsService.getOffres(options.data.id).subscribe(
      offers => {
        this.offers = offers;
      },
      err => (this.error = err.message),
      () => (this.isLoading = false)
    );
  }

  openPreview(index) {
    this.onAction.emit(
      this.offers[index].Photos.map(
        p =>
          <NgxGalleryImage>{
            big: p
          }
      )
    );
  }
  ngOnDestroy(): void {
    this.onAction.emit([]);
  }
}

interface Offer {
  id: number;
  agent: string;
  PhotoBytes?: any;
  PrixHT: number;
  CreatedBy: number;
  Photos: string[];
  Fournisseur: string;
  Created: string;
}
