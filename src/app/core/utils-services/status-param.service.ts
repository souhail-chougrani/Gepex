import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StatusParamService {
  statusUrlSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  statusDossierSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  constructor() { }

  setCurrentStatusUrl(value: string) {
    this.statusUrlSubject.next(value);
  }
  getCurrentStatusUrl() {
    let status: string;
    this.statusUrlSubject.asObservable().subscribe(res => (status = res));
    return status;
  }
  getCurrentStatusUrlSubject() {
    return this.statusUrlSubject;
  }
  getCurrentStatusDossier() {
    let status: string;
    this.statusUrlSubject.asObservable().subscribe(res => (status = res));
    return status;
  }
  setCurrentStatusDossier(value: string) {
    this.statusDossierSubject.next(value);
  }

  getTitle() {
    const statusUrl = this.getCurrentStatusUrl();
    switch (statusUrl.toLowerCase()) {
      case 'encours':
        return 'Dossiers En Cours';
      case 'frontoffice':
        return 'Front Office';
      case 'envoyesociete':
        return 'Dossiers Sélectionnés par Compagnie';
      case 'envoyeagt':
        return 'Dossiers envoyés aux agents :';
      case 'traitesagt':
        return 'Dossiers Traités par AGTs :';
      case 'envoietraite':
        return 'Dossiers Traités';
      case 'annule':
        return 'Dossiers Annulés';
      case 'dtd':
        return 'Dossiers Durée de Traitement Dépassée';
      case 'pec':
        return 'Dossiers Prise En Charge Accordée';
      case 'envoyeplatform':
        return 'Dossiers Envoyés à la PlatForme';
      case 'entraitement':
        return 'Dossiers En Cours de Traitement';
      case 'traites':
        return 'Dossiers Traités';
      case 'archencours':
        return 'En cours (Archiver)';
      case 'archenvoyeplatform':
        return 'Dossiers Envoyés à la PlatForme (Archiver)';
      case 'archtraites':
        return 'Dossiers Traités (Archiver)';
      case 'reforme':
        return 'Dossiers Réforme ';
      case 'nontraitable':
        return 'Dossiers Non Traitables ';
      case 'rejpec':
        return 'Dossiers PEC Rejeté';
      case 'dpec':
        return 'Dossiers Demande de PEC';
      case 'attpec':
        return 'Dossiers en Attente de PEC';
      case 'attvpec':
        return 'Dossiers en Attente de Validation de PEC';
      case 'ecom':
        return 'Dossiers Ecom ';
      case 'rma':
        return 'Dossiers RMA ';
      default:
        return null;
    }
  }

  getCurrentStatus() {
    switch (this.getCurrentStatusUrl().toLowerCase()) {
      case 'encours':
        return 'en cours';
      case 'frontoffice':
        return 'frontoffice';
      case 'envoyesociete':
        return 'selectionnesparcompagnie';
      case 'envoyeagt':
        return 'EnvoyesAGT';
      case 'traitesagt':
        return 'TraitesAGT';
      case 'envoietraite':
        return 'traites';
      case 'annule':
        return 'NonTraites';
      case 'dtd':
        return 'DTD';
      case 'pec':
        return 'PEC';
      case 'envoyeplatform':
        return 'selectionnesparcompagnie';
      case 'entraitement':
        return 'EnCoursDeTraitement';
      case 'traites':
        return 'traites';
      case 'archencours':
        return 'Archive-en cours';
      case 'archenvoyeplatform':
        return 'Archive-selectionnesparcompagnie';
      case 'archtraites':
        return 'Archive-traites';
      case 'reforme':
        return 'reforme';
      case 'nontraitable':
        return 'Non_traitable';
      case 'rejpec':
        return 'REJPEC';
      case 'dpec':
        return 'DPEC';
      case 'attpec':
        return 'ATTPEC';
      case 'attvpec':
        return 'ATTVPEC';
      case 'ecom':
        return 'ecom';
      case 'rma':
        return 'RMA';
      default:
        return null;
    }
  }

  // getCurrentStatusUrl() {

  // }
}
