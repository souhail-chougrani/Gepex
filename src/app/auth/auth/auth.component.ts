import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy {
  isSubmitting = false;
  response: string;
  login = '';
  pass = '';
  subject$ = new Subject<void>();
  constructor(private router: Router, private loginService: UserService) {}

  onFormSubmit() {
    this.isSubmitting = true;
    this.loginService
      .attemptAuth(this.login, this.pass)
      .pipe(takeUntil(this.subject$))
      .subscribe(
        data => {
          if (data) {
            if (+data.CompagnieID !== 0) {
              this.router.navigate(['/societe/missions/home']);
            } else {
              this.router.navigate(['/platform/missions/home']);
            }
          } else {
            this.response =
              'Vous n\'avez pas le droit d\'accéder à cette platform';
            this.isSubmitting = false;
            throw new Error(this.response);
          }
        },
        err => {
          this.response =
            err.error.Title && err.error.Message
              ? `<b>${err.error.Title}</b>` + `<p>${err.error.Message}</p>`
              : err.message || err.statusText;
          this.isSubmitting = false;
        }
      );
  }

  ngOnDestroy() {
    this.subject$.next();
    this.subject$.complete();
  }
}
