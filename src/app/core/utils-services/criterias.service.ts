import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SearchInput } from '../models/SearchInput';
import { StatusParamService } from './status-param.service';
import { PROPS } from './status';

@Injectable({
  providedIn: 'root'
})
export class CriteriasService {
  props = PROPS;

  constructor(private statusParam: StatusParamService) {
    this.initialize();
  }

  getCurrentCriteria() {
    return this.currentSubject().getValue();
  }

  setCurrentCriteria(criteria: SearchInput) {
    this.currentSubject().next(criteria);
  }

  initialize() {
    this.props.forEach(
      key =>
        (this[key] = new BehaviorSubject<SearchInput>(new SearchInput(key)))
    );
  }

  currentSubject() {
    return <BehaviorSubject<SearchInput>>(
      this[this.statusParam.getCurrentStatusUrl().toLowerCase()]
    );
  }

  initializeNext() {
    const cr = new SearchInput(this.statusParam.getCurrentStatusUrl());
    this.setCurrentCriteria(cr);
  }

  hasFilters(): boolean {
    const criteria = this.getCurrentCriteria();
    return Object.keys(criteria).some(
      key => !['type', 'orderBy'].includes(key) && criteria[key]
    );
  }
}
