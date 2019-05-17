import { Component, OnInit } from '@angular/core';
import { UserService } from './core/services/user.service';
import { Observable, merge, of, fromEvent, combineLatest } from 'rxjs';
import { mapTo, map, filter, tap } from 'rxjs/operators';
import { PushNotificationsService } from './core/services/push-notification.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [
    `
      .offline {
        position: absolute;
        bottom: 0;
        text-align: center;
        right: 0;
        left: 0;
        padding: 8px;
        color: #ffffff;
        background-color: #ff5465;
      }
    `
  ]
})
export class AppComponent implements OnInit {
  isLoggedIn$: any;
  online$: Observable<boolean>;

  constructor(
    private userService: UserService,
    private pushNotificationsService: PushNotificationsService,
    private router: Router
  ) {
    this.pushNotificationsService.requestPermission();
  }

  ngOnInit(): void {
    this.isLoggedIn$ = combineLatest(
      this.userService.isAuthenticatedSubject.asObservable(),
      this.router.events.pipe(
        filter(e => e instanceof NavigationEnd),
        map(v => !this.router.url.split('/')[1].includes('home'))
      ),
      (a, b) => a && b
    );
    this.online$ = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    );
  }
}
