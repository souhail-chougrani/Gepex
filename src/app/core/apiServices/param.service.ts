import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { of } from '../../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParamService {
  param = 'param/';
  constructor(private apiSvc: ApiService) {}

  validateUsername(username) {
    return this.apiSvc.get('Web/Users/validate?login=' + username);
  }

  getUsers(type: string, start = 0, count = 10) {
    return this.apiSvc.get(
      `Web/Users?type=${type}&start=${start}&count=${count}`
    );
  }

  getUser(id: number) {
    return this.apiSvc.get('Web/Users/' + id);
  }

  createOrUpdateUser(action: any, user: any) {
    return action === 'add'
      ? this.apiSvc.post('Web/Users/Create', user)
      : this.apiSvc.put('Web/Users/Update', user);
  }

  deleteOrRestoreUser(userId: number, isDeleted: boolean) {
    return this.apiSvc.patch(
      `Web/Users/Update?id=${userId}&isDeleted=${isDeleted}`
    );
  }

  AjouterMarque(marque) {
    return this.post('AGT/AjouterMarque', marque);
  }

  AjouterArticles(articles) {
    return this.post('AGT/AjouterArticles', articles);
  }

  post(path: string, body) {
    return this.apiSvc.post(this.param + path, body);
  }
}
