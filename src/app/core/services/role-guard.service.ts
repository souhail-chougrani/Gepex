import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  CanLoad,
  Route,
  CanActivateChild,
  RouterStateSnapshot
} from '@angular/router';
import { UserService } from './user.service';
import { JwtService } from './jwt.service';
import { AlertService } from '../apiServices/alert.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivateChild, CanLoad {
  connectedUserRole: string;
  connectedUsercompanyId: number;

  constructor(
    public router: Router,
    public userService: UserService,
    public jwtService: JwtService,
    private alertService: AlertService
  ) {}

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    this.connectedUsercompanyId =
      +this.userService.userInfo.CompagnieID === 0 ? 0 : 1;
    this.connectedUserRole = (
      this.userService.userInfo.UserType || ''
    ).toLowerCase();
    if (
      childRoute.url.some(e => e.path === 'encours') &&
      this.connectedUserRole.toLowerCase() === 'operateur' &&
      this.connectedUsercompanyId === 0
    ) {
      this.router.navigateByUrl('/platform/missions/frontoffice');
      return false;
    }
    return true;
  }

  canLoad(route: Route) {
    this.connectedUsercompanyId =
      +this.userService.userInfo.CompagnieID === 0 ? 0 : 1;
    this.connectedUserRole = (
      this.userService.userInfo.UserType || ''
    ).toLowerCase();
    if (this.userService.isLoggedIn) {
      const roles: string[] = route.data.roles;

      const companyId: number = route.data.compagnieID;
      if (
        roles.includes(this.connectedUserRole) &&
        (companyId === -1 || companyId === this.connectedUsercompanyId)
      ) {
        return true;
      } else {
        this.router.navigateByUrl(
          (this.connectedUsercompanyId === 0 ? '/platform' : '/societe') +
            '/missions/home'
        );
        return false;
      }
    }
    this.router.navigateByUrl('/login').then(_ =>
      this.alertService.warn({
        msg: 'Vous n\'êtes pas connecté, connectez-vous et essayez à nouveau'
      })
    );
    return false;
  }
}
