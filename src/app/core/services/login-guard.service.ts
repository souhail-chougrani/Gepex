import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {
  constructor(public router: Router, public userService: UserService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.userService.isLoggedIn) {
      const connectedUsercompanyId = +this.userService.userInfo.CompagnieID;
      this.router.navigateByUrl(
        (connectedUsercompanyId === 0 ? '/platform' : '/societe') +
          '/missions/home'
      );
      return false;
    }
    return true;
  }
}
