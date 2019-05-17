import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StatusParamService } from './status-param.service';
import { PROPS } from './status';

@Injectable({
  providedIn: 'root'
})
export class PageNumberService {
  props = PROPS;

  constructor(private statusParam: StatusParamService) {
    this.initialize();
  }

  getCurrentPageNumber() {
    return this.currentSubject().getValue();
  }

  currentSubject() {
    return <BehaviorSubject<number>>(
      this[this.statusParam.getCurrentStatusUrl().toLowerCase()]
    );
  }

  setCurrentPageNumber(pageN: number) {
    this.currentSubject().next(pageN);
  }

  initialize() {
    this.props.forEach(key => (this[key] = new BehaviorSubject<number>(0)));
  }
}
