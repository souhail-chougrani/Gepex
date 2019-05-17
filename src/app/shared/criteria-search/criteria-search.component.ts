import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SearchInput } from '../../core/models/SearchInput';
import { GlobalService } from '../../core/apiServices/global.service';

import { UserService } from '../../core/services/user.service';
import { of, Observable, Subject } from 'rxjs';
import { CriteriasService } from 'src/app/core/utils-services/criterias.service';
import { takeUntil } from 'rxjs/operators';
import { DATE_FR } from 'src/app/core/models/Utils';

@Component({
  selector: 'app-criteria-search',
  templateUrl: './criteria-search.component.html',
  styleUrls: ['./criteria-search.component.css']
})
export class CriteriaSearchComponent implements OnInit, OnDestroy {
  subject$ = new Subject<void>();
  /******ajouter les jours en français */
  fr = DATE_FR;
  devisExpertOptions = ['Tout', 'Avec devis expert', 'Sans devis expert'];
  Criteria = new SearchInput('');
  companies: any;
  cities: any;
  typesMission$: Observable<any>;
  garanties$: Observable<any>;
  experts$: Observable<any>;
  garages$: Observable<any>;
  marques$: Observable<any>;
  models$: Observable<any>;
  agents$: Observable<any>;
  ShowHideInputTitle = false;
  compagnieID: number;
  garageID: number;
  connectedUserType: string;
  _display: boolean;
  get display(): boolean {
    return this._display;
  }
  @Input()
  set display(value: boolean) {
    this._display = value;
  }

  constructor(
    private gS: GlobalService,
    private userService: UserService,
    private criteriaService: CriteriasService
  ) {}

  ngOnInit() {
    this.compagnieID = +this.userService.getUserInfo().CompagnieID;
    this.garageID = +this.userService.getUserInfo().GarageID;
    this.connectedUserType = this.userService.getUserInfo().UserType;
  }

  appliquer() {
    this.display = false;
    if (!this.criteriaService.hasFilters()) {
      return;
    }
    this.criteriaService.setCurrentCriteria({
      ...this.criteriaService.getCurrentCriteria(),
      ...this.Criteria
    });
  }

  showDialog() {
    this.Criteria = this.criteriaService.getCurrentCriteria();
    this.getData();
    this.display = true;
  }

  showInputTitle() {
    this.ShowHideInputTitle = true;
  }

  getData() {
    if (!this.companies) {
      this.gS
        .getCompagnies()
        .pipe(takeUntil(this.subject$))
        .subscribe(companies => (this.companies = companies));
    }
    if (!this.cities) {
      this.gS
        .getVilles()
        .pipe(takeUntil(this.subject$))
        .subscribe(cities => (this.cities = cities));
    }
    this.typesMission$ = this.gS.getTypeMissions();
    this.garanties$ = this.gS.getGaranties();
    this.experts$ = this.gS.getExperts();
    this.garages$ = this.gS.getGarages();
    this.marques$ = this.gS.getMarques();
  }

  markChanged(event) {
    this.Criteria.ModelID = null;
    if (!event) {
      this.models$ = of([]);
      return;
    }
    this.models$ = this.gS.getModels(event.id);
  }

  ngOnDestroy() {
    this.subject$.next();
    this.subject$.complete();
  }
}
