import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { PRIXGEPEX } from '../models/prix';
import { DetailDossier } from '../models/dossier-detail-affiche';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DossierDetailsService {
  constructor(private apiService: ApiService) {}

  getMission(id: string) {
    return this.apiService.get('Web/Missions/Details?missionId=' + id);
  }

  updateMission(id, mission) {
    return this.apiService.post('Web/Missions/update/' + id, mission);
  }

  getCotation(id: string) {
    return this.apiService.get('Web/Cotations/Details?missionId=' + id);
  }

  updateMissionArticleDesignation(
    fonction,
    missionId,
    cotationEnteteId,
    oldArticleId,
    newArticleId
  ) {
    return this.apiService.put('Web/Cotations/Modifier/Article', {
      fonction,
      missionId,
      cotationEnteteId,
      oldArticleId,
      newArticleId
    });
  }

  getDocs(id: string) {
    return this.apiService.get<DetailDossier>('ged/' + id);
  }

  getOffres(id: number) {
    return this.apiService.get('web/offres/' + id);
  }

  getVoitureDetail(id: string) {
    // return this.apiSer.get(
    //   'dossiers/detail/Voiture?id=' + id + '&format=article'
    // );
    return of({ DossierVIN: <any>{} });
  }

  getImagesAgt(articleId: string, contationLigneId: string) {
    // article.Id contient parfois des espaces pour cela on utilise la fct trim
    return this.apiService.get(
      'ged/cotations/' + articleId.trim() + '/' + contationLigneId + '/images'
    );
  }

  putModifierPrix(missionId, Prix: any[]) {
    return this.apiService.put(
      'Web/Cotations/Modifier/Prix',
      JSON.stringify({
        MissionId: missionId,
        Prix: Prix
      })
    );
  }

  postModifierPrix(
    i: number,
    cotationLigneID: string,
    cotationEnteteID: string,
    a: PRIXGEPEX,
    body: any
  ) {
    return this.apiService.post('Dossiers/Modifier/Prix', body);
  }

  getHistoriqueMission(id) {
    return this.apiService.get('Web/Missions/Historique?missionId=' + id);
  }
}
