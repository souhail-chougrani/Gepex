import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { switchMap, retryWhen } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  _companies$: Promise<any[]>;
  _experts$: Promise<any[]>;
  _marks$: Promise<any[]>;
  _cities$: Promise<any[]>;
  _suppliers$: Promise<any[]>;
  _garages$: Promise<any[]>;
  _garanties$: Promise<any[]>;
  _missionTypes$: Promise<any[]>;
  constructor(private apiService: ApiService, private http: HttpClient) {}

  get(path: string, observer$: Promise<any[]>) {
    observer$ =
      observer$ ||
      this.apiService
        .get('global/' + path)
        .pipe(retryWhen(errors => errors))
        .toPromise()
        .then(res => (observer$ = res));
    return {
      observable: of(observer$).pipe(switchMap(res => res)),
      promise: observer$
    };
  }

  getArticlesByDesignation(designation: string): any {
    return this.apiService.get('/Global/Articles?designation=' + designation);
  }

  getCompagnies() {
    const res = this.get('Compagnies', this._companies$);
    this._companies$ = res.promise;
    return res.observable;
  }

  getExperts() {
    const res = this.get('Experts', this._experts$);
    this._experts$ = res.promise;
    return res.observable;
  }

  getFournisseurs() {
    const res = this.get('Fournisseurs', this._suppliers$);
    this._suppliers$ = res.promise;
    return res.observable;
  }

  getGarages() {
    const res = this.get('Garages', this._garages$);
    this._garages$ = res.promise;
    return res.observable;
  }

  getMarques() {
    const res = this.get('Marques', this._marks$);
    this._marks$ = res.promise;
    return res.observable;
  }

  getModels(markId) {
    return this.apiService.get('global/Models?id=' + markId);
  }

  getVilles() {
    const res = this.get('Villes', this._cities$);
    this._cities$ = res.promise;
    return res.observable;
  }

  getGaranties() {
    const res = this.get('Garanties', this._garanties$);
    this._garanties$ = res.promise;
    return res.observable;
  }

  getTypeMissions() {
    const res = this.get('TypeMissions', this._missionTypes$);
    this._missionTypes$ = res.promise;
    return res.observable;
  }

  getMarkAndModelByVin(vin: string) {
    return this.apiService.get('global/vehicule?numchassis=' + vin);
  }
}
