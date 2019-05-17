import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { SearchInput } from '../models/SearchInput';
import { DossierCount } from '../models/dossier-count';
import { CriteriasService } from '../utils-services/criterias.service';
import { PageNumberService } from '../utils-services/page-number.service';
import { UserService } from '../services/user.service';
import { StatusParamService } from '../utils-services/status-param.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DossiersService {
  private _currentFilters: SearchInput[];
  public get currentFilters(): SearchInput[] {
    return this._currentFilters;
  }

  constructor(
    private apiServ: ApiService,
    private crServ: CriteriasService,
    private pageServ: PageNumberService,
    private loginSer: UserService,
    private statusService: StatusParamService
  ) { }
  /**
   * charger les dossiers selon criteria
   */

  searchMissions(matricule, type = 'matricule') {
    return this.apiServ.get('Web/Missions?matricule=' + matricule + '&type=' + type);
  }

  getDossiers(count) {
    return this.apiServ.post(
      `Web/Missions?status=${this.statusService.getCurrentStatus()}&start=${this.pageServ.getCurrentPageNumber()}&count=${count}`,
      this.crServ.getCurrentCriteria()
    );
  }

  sendMission(params: { Destination: string; missionIds?: number[],
    ArticleIDs?: string[]; }) {
    return this.apiServ.post('Web/Envoi', params);
  }

  sendMissionToAgt(params: {
    missionId?: number;
    AgentID?: number;
    ArticleIDs?: string[];
  }) {
    return this.apiServ.post('Web/Envoi/Agt', params);
  }
  sendMissionToPlatform(params: {
    missionId?: number;
    ArticleIDs?: string[];
  }) {
    return this.apiServ.post('Web/Envoi/Platform', params);
  }

  /**
   * Charger dossiers counts
   */
  getDossierCounts() {
    return this.apiServ.get<DossierCount>('Web/Missions/Count');
  }
  /**
   * charger les agents concerne selon les numero de missions
   */

  getAgtsConcernes(missionId: number) {
    return this.apiServ.get(
      'Web/Missions/AgentsConcernes?missionId=' + missionId
    );
  }

  getAgtsWithMissionCounts() {
    return this.apiServ.get(
      'Web/Users/AgtsMissions?status=' + this.statusService.getCurrentStatus()
    );
  }

  getSavedFilters(userId = null) {
    return this.apiServ.get('Web/Recherches?userId=' + userId);
  }

  deleteSavedFilter(id: number) {
    return this.apiServ.delete('Web/Recherches?id=' + id);
  }

  saveFilter(title: string, criteria: SearchInput, userId = null) {
    return this.apiServ.post('Web/Recherches', {
      userId: userId,
      title: title,
      recherche: criteria
    });
  }

  exportToExcel(date_debut, date_fin, agtIds, compagnieIds) {
    const data = {
      date_debut: date_debut,
      date_fin: date_fin,
      agtIds: agtIds,
      compagnieIds: compagnieIds,
      status: this.statusService.getCurrentStatus()
    };
    return this.downloadExcel(environment.api + 'reports/journal', data);
  }

  downloadExcel(url: string, data: any): Observable<Object[]> {
    return Observable.create(observer => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhr.responseType = 'blob';

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const contentType =
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            const blob = new Blob([xhr.response], { type: contentType });
            const name = xhr
              .getResponseHeader('Content-Disposition')
              .split('=')[1]
              .trim();

            observer.next({ data: blob, fileName: name });
            observer.complete();
          } else {
            observer.error(xhr.response);
          }
        }
      };
      xhr.send(JSON.stringify(data));
    });
  }
}
