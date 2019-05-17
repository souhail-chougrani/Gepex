import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mission, MissionSelected } from '../../core/models/Mission';
import { DossiersService } from '../../core/apiServices/dossiers.service';
import { SearchInput, SavedFilter } from '../../core/models/SearchInput';
import { UserService } from '../../core/services/user.service';
import { Paginator } from 'primeng/paginator';
import { StatusParamService } from '../../core/utils-services/status-param.service';
import { PageNumberService } from '../../core/utils-services/page-number.service';
import { CriteriasService } from '../../core/utils-services/criterias.service';
import { switchMap, takeUntil, debounceTime, share, tap } from 'rxjs/operators';
import { Subject, Observable } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.css']
})
export class PlatformComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  @ViewChild(Paginator)
  paginator: Paginator;
  statusUrl: string;
  title: string;
  userType: string;
  Missions: Mission[] = [];
  criteria: SearchInput;
  missionSelected: MissionSelected[] = [];
  selectedMissionIds: string[] = [];
  first = 0;
  statusDossier: string;
  dossierCount: any;
  makeRequest$ = new Subject<void>();
  // cdk table
  dataSource: { mission: Mission[] }[];
  vehiculeMarks: string[] = [];
  // paginator
  missionsCount = 0;
  error: string;
  missionsAreLoading: boolean;

  constructor(
    private loginSer: UserService,
    private activatedRoute: ActivatedRoute,
    private dSer: DossiersService,
    private statusParam: StatusParamService,
    private crServ: CriteriasService,
    private pageServ: PageNumberService,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe(data => {
      this.statusParam.setCurrentStatusUrl(data.status);
      const status = this.statusParam.getCurrentStatus();
      if (!status) {
        router.navigateByUrl('platform/missions/home');
      }
      this.statusDossier = status;
    });
  }

  ngOnInit() {
    this.makeRequest$
      .pipe(
        tap(() => (this.missionsAreLoading = true)),
        debounceTime(500),
        switchMap(() => this.dSer.getDossiers(this.dossierCount))
      )
      .subscribe(
        res => {
          this.missionsAreLoading = false;
          this.dataSource = res.Result;
          this.missionsCount = res.Count;
        },
        error => {
          this.missionsAreLoading = false;
          this.error = error.error.Message;
        }
      );

    this.statusParam
      .getCurrentStatusUrlSubject()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(next => {
        this.initStatus();
        this.crServ
          .currentSubject()
          .pipe(
            takeUntil(this.unsubscribe$),
            share()
          )
          .subscribe(criteria => {
            this.criteria = criteria;
            this.getDossiers();
          });
      });
    this.userType = this.loginSer.getUserInfo().UserType;
  }

  initStatus() {
    this.title = this.statusParam.getTitle();
    if (this.title === 'default') {
      this.router.navigate(['/platform/missions/home']);
    }
    this.criteria = this.crServ.getCurrentCriteria();
    this.first = this.pageServ.getCurrentPageNumber();
  }

  onPageChange(event) {
    this.first = event.first;
    this.pageServ.setCurrentPageNumber(event.first);
    this.getDossiers();
  }

  getDossiers() {
    this.dossierCount =
      this.paginator && this.paginator.rows > 0 ? this.paginator.rows : 10;
    this.dataSource = this.missionsCount = this.error = null;
    this.makeRequest$.next();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
