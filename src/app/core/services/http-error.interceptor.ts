import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from '../../../../node_modules/rxjs';
import { catchError } from '../../../../node_modules/rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { AlertService } from '../apiServices/alert.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        let error = '';
        if (err.error instanceof Error) {
          error = 'A Front error occurred:' + err.error.message;
        } else {
          error = `Backend returned code ${err.status}, body was: ` + err;
        }

        if (
          err.status === 401 &&
          !request.url.toLowerCase().endsWith('token')
        ) {
          this.userService.logout();
          this.router.navigateByUrl('login').then(_ =>
            this.alertService.warn({
              msg:
                'Vous n\'êtes pas connecté, connectez-vous et essayez à nouveau'
            })
          );
        }

        if (!environment.production) {
          console.error(error);
        }

        return throwError(err);
      })
    );
  }
}
