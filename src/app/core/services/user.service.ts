import { HttpHeaders } from '@angular/common/http';
import { JwtService } from './jwt.service';
import { ApiService } from '../apiServices/api.service';
import { Injectable, OnDestroy } from '@angular/core';
import { UserInfo } from '../models/user.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { CriteriasService } from '../utils-services/criterias.service';
import { PageNumberService } from '../utils-services/page-number.service';

@Injectable()
export class UserService {
  userInfo = new UserInfo();
  isAuthenticated = false;
  isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.jwtService.getDecodedToken() !== null;
  }

  constructor(
    private apiService: ApiService,
    private jwtService: JwtService,
    private loStorService: LocalStorageService,
    private criteriaService: CriteriasService,
    private pageNumberService: PageNumberService
  ) {
    this.populate();
    // this.verifyStorage();
  }

  attemptAuth(login: string, password: string): Observable<UserInfo> {
    const data = 'login=' + login + '&password=' + password;
    return this.apiService
      .post('Token', data, {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded'
        })
      })
      .pipe(
        map(token => {
          this.jwtService.saveToken(token);
          const userData = this.jwtService.getDecodedToken();
          if (userData && userData.UserType.toLowerCase() !== 'agent') {
            this.setUserInfoFromToken(userData);
            this.isAuthenticated = true;
            this.isAuthenticatedSubject.next(true);
            return userData;
          } else {
            return null;
          }
        })
      );
  }
  // Verifier s'il y a JWT dans localStorage et charger les informations d'utilisateur
  // Chargé une fois dans le démarrage d'application
  populate() {
    const userData = this.jwtService.getDecodedToken();
    if (userData === null) {
      this.logout();
      return;
    }
    this.setUserInfoFromToken(userData);
    this.isAuthenticated = true;
    this.isAuthenticatedSubject.next(true);
  }

  verifyStorage() {
    this.loStorService.tokenStorage.subscribe(e => {
      if (e.newValue === null) {
        this.logout();
      } else if (
        (e.oldValue === null && e.newValue) ||
        (e.oldValue && e.newValue)
      ) {
        this.populate();
      }
    });
  }

  logout(): void {
    this.criteriaService.initialize();
    this.pageNumberService.initialize();
    this.jwtService.destroyToken();
    this.userInfo = {} as UserInfo;
    this.isAuthenticated = false;
    this.isAuthenticatedSubject.next(false);
  }

  setUserInfoFromToken(userData: any) {
    this.userInfo.Login = userData.Login;
    this.userInfo.Prenom = userData.Prenom;
    this.userInfo.Nom = userData.Nom;
    this.userInfo.UserType =
      userData.UserType.charAt(0).toUpperCase() +
      userData.UserType.slice(1).toLowerCase();
    this.userInfo.CompagnieID = userData.CompagnieID;
    this.userInfo.GarageID = userData.GarageID;
  }

  getUserInfo() {
    return this.userInfo;
  }
}
