import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class GedService {
  constructor(private apiService: ApiService) {}

  getSrc(missionId: number, index: number, type: string) {
    return this.apiService.get(`/ged/${missionId}/${type}/${index}`);
  }

  getImages(missionId: number, size: 'big' | 'small') {
    return this.apiService.get(`/ged/${missionId}?size=${size}`);
  }
}
