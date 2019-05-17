import { Injectable } from '@angular/core';
import { StatusParamService } from './status-param.service';

@Injectable({
  providedIn: 'root'
})
export class FiltresService {
  filters: { status: string; selectedId: number }[] = [];

  constructor(private statusParam: StatusParamService) {}

  getCurrentFilterId() {
    const status = this.statusParam.getCurrentStatusUrl();
    return (
      this.filters.find(f => f.status.toLowerCase() === status.toLowerCase()) ||
      <any>{}
    ).selectedId;
  }

  setCurrentFilterId(id: number) {
    const status = this.statusParam.getCurrentStatusUrl();
    const selectedFilter = this.filters.find(
      f => f.status.toLowerCase() === status.toLowerCase()
    );
    if (selectedFilter) {
      selectedFilter.selectedId = id;
      return;
    }
    this.filters = [...this.filters, { status: status, selectedId: id }];
  }

  clearCurrentFilter() {
    const status = this.statusParam.getCurrentStatusUrl();
    this.filters = this.filters.filter(f => f.status !== status);
  }
}
