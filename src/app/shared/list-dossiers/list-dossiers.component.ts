import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewContainerRef
} from '@angular/core';
import * as moment from 'moment-timezone';
import { Router } from '@angular/router';
import { StatusParamService } from '../../core/utils-services/status-param.service';
import { UserService } from '../../core/services/user.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, MatSortable, Sort } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { CriteriasService } from 'src/app/core/utils-services/criterias.service';
import { SearchInput, OrderBy } from 'src/app/core/models/SearchInput';
import { DossiersService } from 'src/app/core/apiServices/dossiers.service';
import { takeUntil, take, debounceTime } from 'rxjs/operators';
import { GlobalService } from 'src/app/core/apiServices/global.service';
import { ModalDialogService } from 'ngx-modal-dialog';
import { ExportModalComponent } from './dialogs/export.component';

@Component({
  selector: 'app-list-dossiers',
  templateUrl: './list-dossiers.component.html',
  styleUrls: ['./list-dossiers.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListDossiersComponent implements OnInit, OnDestroy {
  subject$ = new Subject<void>();
  compagnieID: number;
  criteria: SearchInput;
  status = '';
  agents$: Observable<any>;
  @Input()
  error: string;
  // cdk table
  @Input()
  dataSource = null;
  allColumns: string[];
  displayedColumns: string[];
  selection: SelectionModel<string>;
  @ViewChild(MatSort)
  sort: MatSort;
  @Output()
  sortchanged = new EventEmitter<OrderBy>();
  defaultSort: MatSortable = {
    id: 'DateOperation',
    start: 'desc',
    disableClear: true
  };
  companies: any[];
  @Input()
  isLoading: boolean;

  constructor(
    private router: Router,
    private statusSvc: StatusParamService,
    private userService: UserService,
    private criteriaService: CriteriasService,
    private dossierService: DossiersService,
    private globalService: GlobalService,
    private modalDialogService: ModalDialogService,
    private viewRef: ViewContainerRef
  ) {
    this.compagnieID = +this.userService.userInfo.CompagnieID;
    this.allColumns =
      this.compagnieID === 0
        ? COLUMNS
        : COLUMNS.filter(c => c.toLowerCase() !== 'compagnie');
  }

  ngOnInit() {
    moment.locale('fr');
    this.initializeState(this.status);
    // sort
    this.sort.sortChange
      .pipe(
        debounceTime(200),
        takeUntil(this.subject$)
      )
      .subscribe((sort: Sort) => {
        this.dataSource = null;
        this.selection.clear();
        this.criteriaService.setCurrentCriteria({
          ...this.criteriaService.getCurrentCriteria(),
          orderBy: {
            column: sort.active,
            direction: sort.direction
          }
        });
      });
    this.statusSvc
      .getCurrentStatusUrlSubject()
      .pipe(takeUntil(this.subject$))
      .subscribe(status => {
        this.dataSource = null;
        if (!status || this.status === status) {
          return;
        }
        this.status = status;
        this.initializeState(this.status);
        if (
          ['envoyeagt', 'traitesagt', 'envoietraite'].includes(
            status.toLowerCase()
          )
        ) {
          this.agents$ = this.dossierService.getAgtsWithMissionCounts();
        }
      });
    // this.globalService
    //   .getCompagnies()
    //   .pipe(take(1))
    //   .subscribe(companies => (this.companies = companies));
  }

  // initialize columns to be displayed and set the selection to empty array.
  initializeState(status: string) {
    this.allColumns =
      status.toLowerCase() !== 'envoyeagt' &&
      status.toLowerCase() !== 'traitesagt'
        ? COLUMNS.slice(0, -1)
        : COLUMNS;

    this.displayedColumns = this.allColumns.slice(0, 10);
    this.selection = new SelectionModel<string>(true, []);
    this.criteriaService
      .currentSubject()
      .pipe(take(1))
      .subscribe(criteria => {
        this.selection.clear();
        this.criteria = criteria;
        if (this.criteria.orderBy) {
          this.sort.direction = this.criteria.orderBy.direction;
          this.sort.active = this.criteria.orderBy.column;
        } else {
          this.sort.direction = this.defaultSort.start;
          this.sort.active = this.defaultSort.id;
        }
      });
  }

  // navigate to detail/id...
  showDetails(id) {
    this.router.navigate(['missions/detail/' + id]);
  }

  // need in html
  publishedAt(d: Date) {
    return moment(d).fromNow();
  }

  // cdk table show/hide columns + sort all of them after any value changes.
  onColumnToggle() {
    this.displayedColumns.sort(
      (a, b) => this.allColumns.indexOf(a) - this.allColumns.indexOf(b)
    );
  }

  // cdk table selection
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = (this.dataSource || []).length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.forEach(d => this.selection.select(d.id.toString()));
  }

  // Vehicule identification number (VIN) Regex code used for verification.
  vinIsValid(vin: string) {
    return vin && vin.match(/^(?=.*[0-9])(?=.*[A-z])[0-9A-Za-z]{17}$/gi);
  }

  onFilter(event) {
    if (!event || !event.id) {
      return;
    }
    this.criteriaService.setCurrentCriteria({
      ...this.criteriaService.getCurrentCriteria(),
      AgentID: event.id
    });
  }

  onClearFilter() {
    this.criteriaService.setCurrentCriteria({
      ...this.criteriaService.getCurrentCriteria(),
      AgentID: null
    });
  }

  reload() {
    location.reload();
  }

  formatDate(date) {
    return this.dateToFromNowDaily(date);
  }

  dateToFromNowDaily(myDate) {
    const m = moment(myDate + 'Z');
    return m.tz('Africa/Casablanca').calendar(null, {
      lastWeek: 'DD/MM/YYYY'
      // lastDay: '[Yesterday]',
      // sameDay: 'HH:mm',
      // nextDay: '[Tomorrow]',
      // nextWeek: 'dddd',
      // sameElse: function() {
      //   return '[' + fromNow + ']';
      // }
    });
  }

  getSource(companyName: string) {
    const company = this.companies.find(c => c.libelle.includes(companyName));
    return `assets/img/logo-${company ? company.id : 'not-found'}.png`;
  }

  refreshMissions() {
    this.criteriaService.setCurrentCriteria(
      this.criteriaService.getCurrentCriteria()
    );
  }

  exportToExcel() {
    this.modalDialogService.openDialog(this.viewRef, {
      title: 'Exporter vers Excel',
      childComponent: ExportModalComponent,
      settings: {
        notifyWithAlert: false,
        modalDialogClass: 'modal-dialog modal-dialog-centered min-width-700'
      }
    });
  }

  ngOnDestroy() {
    this.subject$.next();
    this.subject$.complete();
  }
}

const COLUMNS = [
  'select',
  'DateOperation',
  'Marque',
  'Model',
  'Matricule',
  'DateMEC',
  'MontantTTC',
  'Compagnie',
  'CompagnieAdv',
  'Expert',
  'Garage',

  'NumMission',
  'DateAccident',
  'NumChassi',
  'VilleAccident',
  'VilleExpertis',
  'NPoliceAssurance',
  'NPoliceAssuranceAdv',
  'referenceCie',
  'typeMission',
  'AGTs'
];
