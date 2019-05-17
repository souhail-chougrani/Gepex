import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewContainerRef,
  ComponentRef,
  OnDestroy
} from '@angular/core';

import { DossiersService } from '../../core/apiServices/dossiers.service';
import { UserService } from '../../core/services/user.service';
import { StatusParamService } from '../../core/utils-services/status-param.service';
import { CountDossiersService } from '../../core/utils-services/count-dossiers.service';
import {
  take,
  takeUntil,
  filter,
  distinctUntilChanged
} from '../../../../node_modules/rxjs/operators';
import { DossierCount } from '../../core/models/dossier-count';
import { AlertService } from '../../core/apiServices/alert.service';
import { ActivatedRoute } from '@angular/router';
import {
  ModalDialogService,
  SimpleModalComponent,
  IModalDialog,
  IModalDialogOptions
} from 'ngx-modal-dialog';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-buttons-actions',
  templateUrl: './buttons-actions.component.html',
  styleUrls: ['./buttons-actions.component.css']
})
export class ButtonsActionsComponent implements OnInit, OnDestroy {
  subject$ = new Subject<void>();
  @Input()
  fromDossierDetails: boolean;
  @Input()
  selectedMissionIds: number[];
  @Input()
  cotationEnteteId: string;
  @Input()
  selectedArticles: string[];
  status = '';
  userType: string;
  compagnieID: number;
  selectedAgentIds: string[];
  @Output()
  completed: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input()
  dossierCount: DossierCount;
  actions = SendActionTypes;
  isLoading: boolean;
  sendingTo: SendActionTypes;
  //Conditions 
  SendArchiveCondition: boolean;
  SendToPlatformCondition: boolean;
  RestoreCondition: boolean;
  SendToAgentCondition: boolean;
  SendToOfficeCondition: boolean;
  constructor(
    private route: ActivatedRoute,
    // doServ used with _this...
    private doServ: DossiersService,
    private userService: UserService,
    private statusParam: StatusParamService,
    private countDossiersService: CountDossiersService,
    private alertSvc: AlertService,
    private modalDialogService: ModalDialogService,
    private viewRef: ViewContainerRef
  ) { }

  ngOnInit() {
    this.userType = this.userService.userInfo.UserType;
    this.compagnieID = +this.userService.userInfo.CompagnieID;
    this.statusParam.statusUrlSubject
      .pipe(
        takeUntil(this.subject$),
        filter(x => !!x),
        distinctUntilChanged()
      )
      .subscribe(s => {
        this.status = this.statusParam.getCurrentStatus();
      });
    if (this.fromDossierDetails) {
      this.statusParam.statusDossierSubject
        .pipe(
          takeUntil(this.subject$),
          distinctUntilChanged()
        )
        .subscribe(e => {
          if (e) {
            this.status = e;
            this.SendToPlatformCondition = ['dpec',
              'attpec',
              'attvpec',
              'rejpec'].includes(this.status.toLowerCase()) && this.compagnieID !== 0;
            this.RestoreCondition = ((this.status.toLowerCase() === 'pec' ||
              this.status.toLowerCase().startsWith('arch')) &&
              this.compagnieID !== 0) ||
              (['nontraites', 'dtd'].includes(status.toLowerCase()) &&
                ['operateur', 'administrateur'].includes(this.userType.toLowerCase()) &&
                this.compagnieID === 0);
            this.SendArchiveCondition = this.compagnieID === 15207 &&
              ['selectionnesparcompagnie', 'dpec','entraitementgepex',
                'attpec',
                'attvpec',
                'rejpec', 'traites'].includes(
                  this.status.toLowerCase()
                );
            this.SendToAgentCondition = this.fromDossierDetails && ['selectionnesparcompagnie','dpec', 'attpec',
            'ecom',
              'attvpec',
              'rejpec', 'frontoffice'].includes(
                this.status.toLowerCase()) &&
              ['operateur', 'administrateur'].includes(this.userType.toLowerCase()) &&
              this.compagnieID === 0;
            this.SendToOfficeCondition = ['dpec','attpec',
              'attvpec',
              'rejpec'].includes(this.status.toLowerCase()) &&
              this.userType === 'Administrateur' &&
              this.compagnieID === 0;

          }
        });
    }
    this.selectedMissionIds = [];
    this.countDossiersService.CountDossierSubject.pipe(
      takeUntil(this.subject$)
    ).subscribe(res => (this.dossierCount = res));
  }

  envoyerGpx(_this) {
    return _this.doServ.envoyerGpx(_this.selectedMissionIds);
  }

  envoyerPlatform(_this) {
    return _this.doServ.envoyerPlatform(_this.selectedMissionIds,
      _this.selectedArticles);
  }

  restore(_this) {
    return _this.doServ.restaurer(_this.selectedMissionIds, _this.status);
  }

  envoyerAgt(_this, selectedAgentIds) {
    return _this.doServ.envoyerAgt(
      _this.selectedMissionIds,
      [selectedAgentIds],
      _this.cotationEnteteId,
      _this.selectedArticles
    );
  }

  envoyerFO(_this) {
    return _this.doServ.envoyerFO(_this.selectedMissionIds, _this.status);
  }

  // ******* RMA only ********
  archive(_this) {
    return _this.doServ.archiver(_this.selectedMissionIds, _this.status);
  }

  // ***************************
  send(action: SendActionTypes) {
    console.log(action , 'i m the action');
    
    this.sendingTo = action;
    if (this.route.snapshot.params['id']) {
      this.selectedMissionIds.push(this.route.snapshot.params['id']);
    }
    if (this.selectedMissionIds && this.selectedMissionIds.length === 0) {
      this.alertSvc.alert({
        msg: 'Veuillez selectionner au moins une mission.'
      });
      return;
    }

    let sendAction: (_this, selectedAgetIds?) => Observable<any>;
    let countStatus = '' ,
      agtOnAction: EventEmitter<string> ,
      platOnAction: EventEmitter<string> ;
    if (action === SendActionTypes.SendToAgent) {
      agtOnAction = new EventEmitter<string>();
      agtOnAction.pipe(take(1)).subscribe(selectedAgetId => {
        this.subscribeToSendResponse(
          this.doServ.sendMissionToAgt({
            missionId: +this.selectedMissionIds[0],
            AgentID: +selectedAgetId,
            ArticleIDs: this.selectedArticles
          }),
          action
        );
      });
    }
    
    switch (action) {
      case SendActionTypes.Restore:
        sendAction = this.restore;
        countStatus = this.status + '|ATTVPEC';
        break;
      case SendActionTypes.Archive:
        sendAction = this.archive;
        countStatus = this.status + '|Archive-' + this.status;
        break;
      case SendActionTypes.SendToAgent:
        sendAction = this.envoyerAgt;
        countStatus = this.status + '|EnvoyesAGT';
        break;
      case SendActionTypes.SendToOffice:
        sendAction = this.envoyerFO;
        countStatus = this.status + '|FrontOffice';
        break;
      case SendActionTypes.SendToPlatform:
        console.log('sending to platform ...');
        
        sendAction = this.envoyerPlatform;
        countStatus = this.status + '|SelectionnesParCompagnie';
        break;
      default:
        break;
    }

    this.modalDialogService.openDialog(this.viewRef, {
      title: 'Confirmation',
      childComponent:
        action === SendActionTypes.SendToAgent
          ? SendToAgtModalComponent
          : SimpleModalComponent,
      data: {
        text:
          this.selectedMissionIds.length > 1
            ? `<h6>Ces dossiers seront ${action.replace(
              'er',
              'és <b>'
            )}</b></h6>`
            : `<h6>Ce dossier sera ${action.replace('er', 'é <b>')}</b></h6>` +
            `
        <br/>
        <h6>Êtes-vous sûr de vouloir continuer ?</h6>`,
        selectedMissionId:
          action === SendActionTypes.SendToAgent
            ? this.selectedMissionIds[0]
            : 0,
        agtOnAction: agtOnAction,
        platOnAction : platOnAction
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
          text: action.includes('Envoyer') ? 'ENVOYER' : action.toUpperCase(),
          buttonClass: 'btnAct',
          onAction: () => {
            console.log('oh no inside the wrong condition');
            
            if(action !== SendActionTypes.SendToPlatform){
              
            this.subscribeToSendResponse(
              this.doServ.sendMission({
                Destination: countStatus.split('|')[1],
                missionIds: this.selectedMissionIds.map(Number),
                ArticleIDs: this.selectedArticles
              }),
              action
            );
            }
            else {
              console.log('sending to platofrom .. inside else if');
              
                this.subscribeToSendResponse(
                  this.doServ.sendMissionToPlatform({
                    missionId: +this.selectedMissionIds[0],
                    ArticleIDs: this.selectedArticles
                  }),
                  action
                );
            }
            return true;
          }
        }
      ]
    });
  }

  subscribeToSendResponse(obs: Observable<any>, action: SendActionTypes) {
    this.isLoading = true;
    obs.subscribe(
      res => {
        this.completed.emit(true);
        // this.alertSvc.success({
        //   msg: `Mission ${
        //     action.includes('Envoyer')
        //       ? 'envoyée'
        //       : action.toLowerCase().replace('er', 'ée')
        //   } avec succée.`
        // });
      },
      err => {
        this.alertSvc.error({
          msg: err.error
            ? `${err.error.Title}, ${err.error.Message}`
            : `code: ${err.status}, ${err.message}`
        });
      },
      () => {
        this.selectedMissionIds = [];
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.subject$.next();
    this.subject$.complete();
  }
}

@Component({
  template: `
    <div class="alert alert-warning" role="alert" *ngIf="agents?.length === 0">
      Merci d'accédez aux détails de cette mission, Et de vérifier/courriger le
      nom du véhicule.
    </div>
    <div [innerHTML]="content"></div>
    <br />
    <br />
    <form [formGroup]="form">
      <ng-select
        [items]="agents"
        placeholder="aucun agent selectionné"
        bindValue="id"
        bindLabel="login"
        [loading]="isLoading"
        formControlName="agent">
        <ng-template ng-option-tmp let-item="item">
          <div class="d-flex justify-content-between">
            <span>{{item.login}}</span>
            <span class="badge badge-pill badge-primary-gray d-flex align-items-center">{{item.missionCount}}</span>
          </div>
        </ng-template>
      </ng-select>
    </form>
  `
})
export class SendToAgtModalComponent implements IModalDialog {
  form: FormGroup;
  agents: any;
  selectedMissionId: any;
  content: string;
  internalActionButtons = [];
  agtOnAction: EventEmitter<number>;
  isLoading: boolean;

  constructor(fb: FormBuilder, private dossierService: DossiersService) {
    this.form = fb.group({
      agent: [null, Validators.required]
    });
  }

  dialogInit(
    reference: ComponentRef<IModalDialog>,
    options: Partial<IModalDialogOptions<any>>
  ) {
    this.selectedMissionId = options.data.selectedMissionId;

    this.content = (<string>options.data.text).split('<br/>')[0];
    this.agtOnAction = options.data.agtOnAction;
    options.actionButtons = [
      {
        text: 'ANNULER',
        buttonClass: 'btnAct',
        onAction: () => true
      },
      {
        text: 'ENVOYER',
        buttonClass: 'btnAct',
        onAction: () => this.sendToAgt()
      }
    ];
    this.isLoading = true;
    this.dossierService
      .getAgtsConcernes(this.selectedMissionId)
      .subscribe(
        agts => (this.agents = agts),
        err => err,
        () => (this.isLoading = false)
      );
  }

  sendToAgt(): any {
    this.form.controls.agent.markAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.agtOnAction.emit(this.form.controls.agent.value);
    return true;
  }
}

enum SendActionTypes {
  'Restore' = 'Restaurer',
  'Archive' = 'Archiver',
  'SendToOffice' = 'Envoyer à Front Office',
  'SendToPlatform' = 'Envoyer à la platforme',
  'SendToAgent' = 'Envoyer à l\'agent'
}
