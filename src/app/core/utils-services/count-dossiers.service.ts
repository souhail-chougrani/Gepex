import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { DossierCount } from '../models/dossier-count';

@Injectable({
  providedIn: 'root'
})
export class CountDossiersService {
  CountDossierSubject = new BehaviorSubject<DossierCount>(new DossierCount({}));
  constructor() { }
  setCountDossiers(value: DossierCount) {
    this.CountDossierSubject.next(value);
  }
}
