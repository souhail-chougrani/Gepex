import { HttpClient } from '@angular/common/http';
import { StatusParamService } from '../../core/utils-services/status-param.service';

import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ViewContainerRef,
  EventEmitter,
  Output
} from '@angular/core';
import { DossierDetailsService } from '../../core/apiServices/dossier-details.service';

import { NgxGalleryOptions, NgxGalleryImage } from 'ngx-gallery';
import { NgxGalleryComponent } from 'ngx-gallery';
import { environment } from '../../../environments/environment';
import { NgForm } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { PrixStatistique, PrixArticle } from '../../core/models/prix';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../core/apiServices/alert.service';
import { editDossier, DossierCount } from '../../core/models/dossier-count';
import { CountDossiersService } from '../../core/utils-services/count-dossiers.service';
import { DossiersService } from '../../core/apiServices/dossiers.service';
import { ModalDialogService, SimpleModalComponent } from 'ngx-modal-dialog';
import { take, takeUntil } from 'rxjs/operators';
import { OffresModalComponent } from './dialogs/offres.component';
import { Mission } from 'src/app/core/models/Mission';
import {
  ChangePricesModalComponent,
  ChangingPriceItem
} from './dialogs/change-prices.component';
import { Cotation } from 'src/app/core/models/CotationsMission';
import { PrintService } from '../services/print.service';
import { Subject } from 'rxjs';
import { EditDesignationModalComponent } from './dialogs/edit-designation.component';
import { TRAITESAGT, TRAITES, STATUS_AFFICHER_LEGENDE, STATUS_AFFICHER_LEGENDE_CIE } from 'src/app/core/utils-services/status';
import { DEVIS_GEPEX, DEVIS_EXPERT } from 'src/app/core/models/Constants/mission';

@Component({
  selector: 'app-table-devis',
  templateUrl: './table-devis.component.html',
  styleUrls: ['./table-devis.component.css']
})
export class TableDevisComponent implements OnInit {
  api = environment.api;
  @ViewChild('gallery')
  gallery: NgxGalleryComponent;
  @ViewChild('content1')
  contentDataRef: NgbModal;
  display: boolean[] = [];
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  // When select article to send them to agt.
  selectedArticles: string[];
  @Output()
  OnSelectedArticle = new EventEmitter<string[]>();

  // Cotations...
  @Input()
  cotationsData: { Cotations: any[]; PrixRefs: any[] };
  @Input()
  articleEnvoyer: false;
  @Input()
  selectedMission: Mission;
  @Input()
  error: any;

  // status dossiers
  status: any;
  /**Conditions */
  //Test pour afficher case à cocher aticle :
  articleSelectAffiche: boolean;
  //Test Pour afficher le message Chez AGT : 
  legendMsg: string = "Chez l'AGT";
  affichedMsg = false;
  //Test Pour Surligner La ligne pour l'expert
  highLightSelectedCie = false;
  //Test Pour afficher le message : 
  legendCieMsg: string = "à Traiter Par Gepex";
  affichedCieMsg = false;
  // dialog variables to change prices *GPX*.
  pricesToUpdate: ChangingPriceItem[] = [];

  // Connected user type.
  compagnieID: number;
  types: string[];

  /***variable Chart */
  chartData: { labels: string[]; data: ChartData[] } = { labels: [], data: [] };
  closeResult: string;

  DossierCount: DossierCount;
  offres: any;
  photos: any;
  @Output()
  OnSendButtonClicked = new EventEmitter();
  subject$ = new Subject<void>();
  isSubmitting: boolean;
  isSending: boolean;
  constructor(
    private dossierDetailsService: DossierDetailsService,
    private statusPara: StatusParamService,
    private userService: UserService,
    private modalService: NgbModal,
    private httpClient: HttpClient,
    private alertSvc: AlertService,
    private countDossiersService: CountDossiersService,
    private doServ: DossiersService,
    private modalDialogService: ModalDialogService,
    private viewRef: ViewContainerRef,
    private printService: PrintService
  ) { }

  ngOnInit() {
    this.compagnieID = +this.userService.getUserInfo().CompagnieID;

    this.galleryOptions = [
      {
        image: false,
        thumbnails: false,
        width: '0px',
        height: '0px',
        previewCloseOnClick: true,
        previewZoom: true,
        previewSwipe: true,
        previewRotate: true,
        previewFullscreen: true,
        previewKeyboardNavigation: true,
        previewCloseOnEsc: true
      }
    ];
    this.statusPara.statusDossierSubject
      .pipe(takeUntil(this.subject$))
      .subscribe(e => {
        this.status = e;
        this.articleSelectAffiche =
          [
            'dpec',
            'attpec',
            'attvpec',
            'rejpec',
            'frontoffice',
            'selectionnesparcompagnie',
          ].includes(this.status.toLowerCase())
        if (['traitesagt', 'traites'].includes(this.status.toLowerCase())) this.legendMsg = "Traite par l'AGT"
        if (STATUS_AFFICHER_LEGENDE.includes(this.status)) this.affichedMsg = true;
        if (STATUS_AFFICHER_LEGENDE_CIE.includes(this.status)) {
          this.highLightSelectedCie = true;
          this.affichedCieMsg = true
        };

      });
    this.countDossiersService.CountDossierSubject.pipe(
      takeUntil(this.subject$)
    ).subscribe(res => (this.DossierCount = res));

  }

  showDialog(i: number) {
    this.display[i] = true;
  }

  OnClose(i: number, form: NgForm) {
    this.display[i] = false;
    form.reset();
  }

  envoyerPrix() {
    this.isSubmitting = true;
    this.dossierDetailsService
      .putModifierPrix(this.selectedMission.id, this.pricesToUpdate)
      .subscribe(
        res => {
          this.pricesToUpdate = [];
        },
        err =>
          this.alertSvc.error({
            msg: err.error
              ? `${err.error.Title}. ${err.error.Message}`
              : err.message
          }),
        () => (this.isSubmitting = false)
      );
  }

  changerPrixGepex(article) {
    const onAction = new EventEmitter<ChangingPriceItem>();
    this.modalDialogService.openDialog(this.viewRef, {
      title: 'Modification de prix: ' + article.Designation,
      childComponent: ChangePricesModalComponent,
      data: {
        article: article,
        onAction: onAction
      },
      settings: {
        notifyWithAlert: false,
        modalDialogClass: 'modal-dialog modal-dialog-centered min-width-700',
        bodyClass: 'modal-body modal-body-scroll p-0'
      }
    });
    onAction.pipe(take(1)).subscribe((value: ChangingPriceItem) => {
      article.PrixHT = value.PrixHT;
      article.QteDemande = value.QteDemande;
      article.TypeArticle = value.TypeArticle;
      article.Remise = value.Remise;
      this.pricesToUpdate.push({
        ...value,
        CotationLigneID: article.CotationLigneID
      });
    });
  }

  onselectedArticle() {
    this.OnSelectedArticle.emit(this.selectedArticles);
  }

  // ********* need in html **********
  someArticle(id) {
    return this.pricesToUpdate.some(a => a.ArticleID === id);
  }

  removeSelectedPrice(article) {
    this.deleteArticle(article.ArticleID);
    article.PrixHT = 0;
    article.TypeArticle = 'vide';
    article.QteDemande = 1;
  }

  deleteArticle(id) {
    this.pricesToUpdate = this.pricesToUpdate.filter(a => a.ArticleID !== id);
  }
  // ********************************

  displayChart(article) {
    const url =
      this.api +
      '/dossiers/detail/Graphe?id=' +
      this.selectedMission +
      '&format=article';
    this.httpClient
      .post<PrixStatistique>(
        url,
        JSON.stringify({
          Vehicule: this.selectedMission.Marque,
          Designation: article.Designation
        })
      )
      .subscribe(prix => {
        this.chartData = { labels: [], data: [] };
        const chartLabels = ['REC', 'ORG', 'ADP'];

        chartLabels.forEach(lbl => {
          if (prix.Prix[lbl]) {
            this.chartData.labels = prix.Prix.REC.map(e => e.Date.toString());
            this.chartData.data.push({
              label: lbl,
              data: prix.Prix[lbl].map(e => e.Prix)
            });
          }
        });
      });

    this.open1(this.contentDataRef);
  }

  open1(content) {
    this.modalService
      .open(content, { windowClass: 'dark-modal', size: 'lg' })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openOffres(id: any, offreCount) {
    if (offreCount === 0) {
      return;
    }
    const onPreviewAction = new EventEmitter<NgxGalleryImage[]>();
    this.modalDialogService.openDialog(this.viewRef, {
      title: 'Liste des Offres',
      childComponent: OffresModalComponent,
      data: {
        id: id,
        onAction: onPreviewAction
      },
      settings: {
        notifyWithAlert: false
      },
      actionButtons: [
        {
          text: 'OK',
          buttonClass: 'btnAct'
        }
      ]
    });
    onPreviewAction.pipe(takeUntil(this.subject$)).subscribe(e => {


      if (e.length == 0) {
        console.log('emited from offres', e);
        this.gallery.images = e;
      } else {
        this.gallery.images = e;
        if (this.gallery.oldImagesLength > 0) {

          // this.galleryImages = e;
          this.gallery.preview.src = e[0].big;
          this.gallery.openPreview(0);
        }
      }
    }
    );
  }

  displayAlert(isPricesToUpdateEmpty) {
    this.modalDialogService.openDialog(this.viewRef, {
      title: 'Echec de l\'envoi !',
      childComponent: SimpleModalComponent,
      data: {
        text: isPricesToUpdateEmpty
          ? `
        <p><b>L\'envoi à échoué</b>. Merci de vérifier vos données.</p>
        <br/>
        <div class="alert alert-warning" role="alert">
        Cela peut arriver si un ou plusieurs articles ont des valeurs vides
        </div>
        `
          : `<p><b>L\'envoi à échoué</b>. Veuillez enregistrer vos données avant de l'envoi.</p>`
      },
      settings: {
        notifyWithAlert: false
      },
      actionButtons: [
        {
          text: 'OK',
          buttonClass: 'btnAct'
        }
      ]
    });
  }

  sendWarningMessages() {
    //  let text = null;
  }

  sendToSocity() {
    if (!this.cotationsData) {
      this.displayAlert(true);
      return;
    }
    const quot = this.cotationsData.Cotations.find(
      x => x.Fonction === DEVIS_GEPEX
    ).Details;
    let validGepexTotal : boolean = true;
    if(this.cotationsData.Cotations.find(x => x.Fonction === DEVIS_EXPERT)){
      validGepexTotal =  (this.cotationsData.Cotations.find(x => x.Fonction === DEVIS_EXPERT).TotalTTC
      - this.cotationsData.Cotations.find(x => x.Fonction === DEVIS_GEPEX).TotalTTC) > 0;
    }
    
    const typeIsNullOrUndefined = (<PrixArticle[]>quot).some(
      a => !a.TypeArticle
    );
    const isPricesToUpdateEmpty = this.pricesToUpdate.length === 0;
    if (typeIsNullOrUndefined || !isPricesToUpdateEmpty) {
      this.displayAlert(isPricesToUpdateEmpty);
      return;
    }
    console.log(validGepexTotal);

    if (!validGepexTotal) {
      this.displayWarning();
      return;
    }
    this.modalDialogService.openDialog(this.viewRef, {
      title: 'Envoi à la société',
      childComponent: SimpleModalComponent,
      data: {
        text: `<h6>Ce dossier sera envoyée à <b>la Société</b></h6>
        <br/>
        
        </div>
        <br/><h6>Êtes-vous sûr de vouloir continuer ?</h6>`
      },
      settings: {
        notifyWithAlert: false
      },
      actionButtons: [
        {
          text: 'ANNULER',
          buttonClass: 'btnAct',
          onAction: () => true
        },
        {
          text: 'ENVOYER',
          buttonClass: 'btnAct',
          onAction: () => this.sendToSocietyAction()
        }
      ]
    });
  }
  private sendToSocietyAction() {

    this.isSending = true;
    this.doServ
      .sendMission({
        Destination: 'Traites',
        missionIds: [this.selectedMission.id]
      })
      .subscribe(res => {
        this.alertSvc.success({
          msg: 'Mission envoyée avec succée.'
        });
      }, err => {
        this.alertSvc.error({
          msg: err.error
            ? `${err.error.Title}, ${err.error.Message}`
            : `code: ${err.status}, ${err.message}`
        });
      }, () => {
        this.countDossiersService.setCountDossiers(editDossier(this.DossierCount, 'traitesagt|traites', 1));
        this.statusPara.setCurrentStatusDossier('Traites');
        this.isSending = false;
      });
    this.OnSendButtonClicked.emit({
      status: 'traitesagt|traites',
      toSocity: true
    });
    return true;
  }

  displayWarning(): any {
    this.modalDialogService.openDialog(this.viewRef, {
      title: 'Attention !',
      childComponent: SimpleModalComponent,
      data: {
        text: `<h6>Ce dossier sera envoyée à <b>la Société</b></h6>
        <br/>
        <div class="alert alert-warning">
        <p>Veuillez noter que :</p>
        <ul>
          <li>
            Un ou plusieus prixHT sont vides ou non modifiés.
          </li>
          <li>
            Le total devis gepex est supérieur au total devis expert.
          </li>
        </ul>
        </div>
        <br/><h6>Êtes-vous sûr de vouloir continuer ?</h6>`
      },
      settings: {
        notifyWithAlert: false
      },
      actionButtons: [
        {
          text: 'ANNULER',
          buttonClass: 'btnAct',
          onAction: () => true
        },
        {
          text: 'ENVOYER',
          buttonClass: 'btnAct',
          onAction: () => this.sendToSocietyAction()
        }
      ]
    });
  }

  getQuotByFunction(quots: Cotation[], fonction: string) {
    return quots.find(q => q.Fonction === fonction);
  }

  openEditDesignationDialog(
    fonction,
    cotationEnteteId,
    articleId,
    designation
  ) {
    this.modalDialogService.openDialog(this.viewRef, {
      title: 'Modification du designation:',
      childComponent: EditDesignationModalComponent,
      data: {
        misionId: this.selectedMission.id,
        fonction: fonction,
        cotationEnteteId: cotationEnteteId,
        articleId: articleId,
        designation: designation
      }
    });
  }

  print(element: HTMLElement) {
    this.printService.print(element, this.selectedMission);
  }
}

interface ChartData {
  label: string;
  data: number[];
}
