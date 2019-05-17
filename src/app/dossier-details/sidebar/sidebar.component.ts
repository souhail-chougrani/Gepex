import {
  Component,
  Input,
  ViewContainerRef,
  EventEmitter,
  NgZone,
  OnInit,
  ViewChild,
  SimpleChanges,
  OnChanges,
  AfterViewInit
} from '@angular/core';
import { ModalDialogService } from 'ngx-modal-dialog';
import { EditMissionDialogComponent } from './dialogs/edit-mission-dialog.component';
import { take, takeUntil, filter } from 'rxjs/operators';
import { SignalRService } from 'src/app/core/services/signalr.service';
import { AlertService } from 'src/app/core/apiServices/alert.service';
import { DossierDetailsService } from 'src/app/core/apiServices/dossier-details.service';
import { Subject } from 'rxjs/Subject';
import { GedService } from 'src/app/core/apiServices/ged.service';
import {
  NgxGalleryComponent,
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation
} from 'ngx-gallery';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit, OnChanges {
  unsubscribe$ = new Subject<void>();
  @Input()
  mission: any;
  @Input()
  docAv: any[];
  @Input()
  docBase: any[];
  @Input()
  selectedMissionId: any;
  @ViewChild('galleryDocAV')
  galleryDocAV: NgxGalleryComponent;
  @ViewChild('galleryDocBase')
  galleryDocBase: NgxGalleryComponent;
  galleryOptions: NgxGalleryOptions[];
  imagesBeforeReparation: NgxGalleryImage[];
  imagesBeforeReparationStore: number[] = [];
  baseDocuments: NgxGalleryImage[];
  baseDocumentsStore: number[] = [];

  constructor(
    private dossierDetailService: DossierDetailsService,
    private modalDialogService: ModalDialogService,
    private viewRef: ViewContainerRef,
    private _signalRService: SignalRService,
    private _ngZone: NgZone,
    private alertService: AlertService,
    private gedService: GedService,
    private sanitization: DomSanitizer
  ) {
    this.BroadCastDevis();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['docAv']) {
      this.imagesBeforeReparation = (this.docAv || []).map(d => ({
        small: d,
        big: ''
      }));
      this.baseDocuments = (this.docBase || []).map(d => ({
        small: d,
        big: ''
      }));
    }
  }

  ngOnInit() {
    this.galleryOptions = [
      {
        image: false,
        width: '100%',
        height: '90px',
        imagePercent: 80,
        thumbnailsPercent: 10,
        thumbnailsMargin: 10,
        thumbnailMargin: 10,
        thumbnailsColumns: 3,
        previewCloseOnClick: true,
        previewZoom: true,
        imageAnimation: NgxGalleryAnimation.Rotate,
        imageSwipe: true,
        previewSwipe: true,
        previewRotate: true,
        previewFullscreen: true,
        previewKeyboardNavigation: true,
        previewCloseOnEsc: true
      }
    ];
    this.subscribeToGalleries();
  }

  subscribeToGalleries() {
    this.galleryDocAV.previewChange
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((e: any) => !this.imagesBeforeReparationStore.includes(e.index))
      )
      .subscribe(e => {
        this.getSrc(e.index, 'docav').subscribe(
          data => {
            const oldImg = this.galleryDocAV.preview.images[e.index];
            this.galleryDocAV.preview.images[
              e.index
            ] = this.galleryDocAV.preview.getSafeUrl(
              'data:image/jpeg;base64,' + data
            );
            if (!oldImg) {
              this.galleryDocAV.preview.src = this.galleryDocAV.preview.images[
                e.index
              ];
            }
            this.imagesBeforeReparationStore.push(e.index);
          },
          err => (this.galleryDocAV.preview.src = fallbackImage)
        );
      });
    this.galleryDocBase.previewChange
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((e: any) => !this.baseDocumentsStore.includes(e.index))
      )
      .subscribe(e => {
        this.getSrc(e.index, 'docbase').subscribe(
          data => {
            const oldImg = this.galleryDocBase.preview.images[e.index];
            this.galleryDocBase.preview.images[
              e.index
            ] = this.galleryDocBase.preview.getSafeUrl(
              'data:image/jpeg;base64,' + data
            );
            if (!oldImg) {
              this.galleryDocBase.preview.src = this.galleryDocBase.preview.images[
                e.index
              ];
            }
            this.baseDocumentsStore.push(e.index);
          },
          err => (this.galleryDocBase.preview.src = fallbackImage)
        );
      });
  }

  getSrc(index, type) {
    return this.gedService.getSrc(this.mission.id, index, type);
  }

  handleMissionEdit() {
    this.modalDialogService.openDialog(this.viewRef, {
      title: 'Modification Mission',
      childComponent: EditMissionDialogComponent,
      data: {
        mission: this.mission
      },
      settings: {
        notifyWithAlert: false,
        modalDialogClass: 'modal-dialog modal-dialog-centered min-width-700'
      }
    });
  }

  BroadCastDevis() {
    this._signalRService.missionDetailsBroadCast
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((updatedMission: any) => {
        this._ngZone.run(() => {
          if (+this.selectedMissionId === +updatedMission.missionId) {
            Object.assign(this.mission, {
              ...this.mission,
              DateMEC: updatedMission.DateMEC,
              Marque: updatedMission.Marque,
              Model: updatedMission.Model,
              NumChassi: updatedMission.NumChassi
              // Matricule: updatedMission.Matricule
            });
            this.alertService.success({
              msg:
                'Une modifiation sur les détails de cette mission a été effectué'
            });
          }
        });
      });
  }
}

const fallbackImage =
  'data:image/png;base64,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';
