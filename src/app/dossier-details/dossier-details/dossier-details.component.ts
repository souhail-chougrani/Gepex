import { SignalRService } from './../../core/services/signalr.service';
import { Cotation } from './../../core/models/CotationsMission';
import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DossierDetailsService } from '../../core/apiServices/dossier-details.service';
import { StatusParamService } from '../../core/utils-services/status-param.service';
import { Historique } from '../../core/models/Historique';
import { environment } from '../../../environments/environment';
import { AlertService } from '../../core/apiServices/alert.service';
import { StatusBroadCast } from 'src/app/core/models/notification';
import { PushNotificationsService } from 'src/app/core/services/push-notification.service';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GedService } from 'src/app/core/apiServices/ged.service';

@Component({
  selector: 'app-dossier-details',
  templateUrl: './dossier-details.component.html',
  styleUrls: ['./dossier-details.component.css']
})
export class DossierDetailsComponent implements OnInit, OnDestroy {
  api = environment.api;
  statusDossier: string;
  selectedMissionId: string;
  mission: any;
  sidebardisplay: boolean;
  missionHistory: Historique[];
  selectedMissionIds = [];
  cotationsData: { Cotations: Cotation[]; PrixRefs: any[] };
  cotationEnteteId: string;
  PrixRefs: any[];
  selectedArticles: string[] = [];
  error: any;
  quotsError: any;
  subject$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private doSer: DossierDetailsService,
    private statusParam: StatusParamService,
    private _signalRService: SignalRService,
    private _ngZone: NgZone,
    private alertSvc: AlertService,
    private pushNotificationsService: PushNotificationsService,
    private gedService: GedService
  ) {}

  ngOnInit() {
    this.selectedMissionId = this.route.snapshot.params['id'];
    if (isNaN(+this.selectedMissionId)) {
      this.error = {
        status: 'Mission n\'existe pas',
        message:
          'La mission que vous chercher n\'existe . S\'il vous plait ne pas modifier dans l\'Url'
      };
    } else {
      this.loadData();
      this.selectedMissionIds.push(this.selectedMissionId);
      this.statusParam.statusDossierSubject
        .pipe(takeUntil(this.subject$))
        .subscribe(s => {
          this.statusDossier = s;
        });
      this.BroadCastStatus();
      this.BroadCastDevis();
    }
  }

  loadData() {
    this.error = null;
    this.doSer.getMission(this.selectedMissionId).subscribe(
      MissionInfo => {
        this.statusParam.setCurrentStatusDossier(MissionInfo.Mission.Status);
        this.mission = MissionInfo.Mission;
      },
      err => (this.error = err),
      () => this.getQuots()
    );
  }

  manipulateQuots(cotationsData) {
    if (!this.statusDossier) {
      return;
    }
    this.cotationsData = cotationsData;
    const sortedQuots = [
      'GARAGISTE',
      'EXPERT',
      'AGT',
      'GEPEX',
      'Etat de Synthèse'
    ];
    const quots = this.cotationsData.Cotations || [];

    // add 'etat de synthese' element.
    if (quots.some(q => q.Fonction === sortedQuots[3])) {
      quots.push({
        CotationEnteteID: null,
        DateDemande: null,
        Fonction: sortedQuots[4],
        Details: quots.find(c => c.Fonction === sortedQuots[3]).Details,
        MainOeuvre: null,
        TotalTTC: null
      });
    }
    // sortig data as the SortedQuots array order.
    quots.sort(
      (a, b) =>
        sortedQuots.indexOf(a.Fonction) - sortedQuots.indexOf(b.Fonction)
    );
  }

  findArticleById(array: any[], id: any) {
    if (!array.some(x => x.ArticleID === id)) {
      return {
        TypeArticle: '',
        PrixHT: ''
      };
    }
    const article = array.find(x => x.ArticleID === id);
    return {
      TypeArticle: article.TypeArticle,
      PrixHT: article.PrixHT
    };
  }

  // Get Cotations.
  getQuots() {
    this.doSer.getCotation(this.selectedMissionId).subscribe(
      quotsData => this.manipulateQuots(quotsData),
      err => (this.quotsError = err.message),
      () => {
        if (this.mission.docAvCount > 0 || this.mission.docBaseCount > 0) {
          this.gedService.getImages(this.mission.id, 'small').subscribe(
            e => {
              this.mission.docAv = e.docAv;
              this.mission.docBase = e.docBase;
            },
            err => (this.error = err)
          );
        }
      }
    );
  }

  // SignalR
  BroadCastStatus() {
    this._signalRService.statusBroadCast
      .pipe(takeUntil(this.subject$))
      .subscribe((notif: StatusBroadCast) => {
        this._ngZone.run(() => {
          if (notif.missionsids.includes(+this.selectedMissionId)) {
            this.statusParam.setCurrentStatusDossier(notif.status);
            if (
              ['traitesagt', 'envoyesagt'].includes(notif.status.toLowerCase())
            ) {
              this.getQuots();
            }
            const message =
              'une modification a été effectué sur le dossier numéro ' +
              this.selectedMissionId;
            if (this.pushNotificationsService.permission === 'default') {
              this.pushNotificationsService.generateNotification([
                {
                  title: 'Gepex',
                  alertContent: message
                }
              ]);
            } else {
              this.alertSvc.success({
                msg: message,
                timeout: 5000
              });
            }
          }
        });
      });
  }

  BroadCastDevis() {
    this._signalRService.devisBroadCast
      .pipe(takeUntil(this.subject$))
      .subscribe((devis: any) => {
        this._ngZone.run(() => {
          if (+this.selectedMissionId === devis.missionId) {
            const newQuot = devis.Cotation;
            const oldQuot = this.cotationsData.Cotations.find(
              c => c.Fonction === devis.Cotation.Fonction
            );
            const oldQuotDetails = oldQuot.Details;
            for (let i = 0; i < oldQuotDetails.length; i++) {
              oldQuotDetails[i] = {
                ...oldQuotDetails[i],
                MontantHT: newQuot.Details[i].MontantHT,
                MontantTTC: newQuot.Details[i].MontantTTC,
                PrixHT: newQuot.Details[i].PrixHT,
                TVA: newQuot.Details[i].TVA,
                QteDemande: newQuot.Details[i].QteDemande,
                TypeArticle: newQuot.Details[i].TypeArticle,
                Remise: newQuot.Details[i].Remise
              };
            }
            oldQuot.TotalTTC = newQuot.TotalTTC;
            this.alertSvc.success({
              msg: 'Devis ' + newQuot.Fonction + ' a été modifié.',
              timeout: 5000
            });
          }
        });
      });
  }

  ngOnDestroy(): void {
    this.subject$.next();
    this.subject$.complete();
  }
}
