import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

declare var require: any;

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {
  public permission: Permission;
  public tinycon: any;
  constructor() {
    this.permission = this.isSupported() ? 'default' : 'denied';
    this.tinycon = require('tinycon');
    this.tinycon.setOptions({
      width: 7,
      height: 9,
      font: '10px arial',
      color: '#ffffff',
      background: '#dc3545',
      fallback: true
    });
  }

  public isSupported(): boolean {
    return 'Notification' in window;
  }

  requestPermission(): void {
    const self = this;
    if ('Notification' in window) {
      Notification.requestPermission(function(status) {
        return (self.permission = status);
      });
    }
  }

  create(title: string, options?: PushNotification): any {
    const self = this;
    return new Observable(function(obs) {
      if (!('Notification' in window)) {
        console.log('Notifications are not available in this environment');
        obs.complete();
      }
      if (self.permission !== 'granted') {
        console.log(
          'The user hasn\'t granted you permission to send push notifications'
        );
        obs.complete();
      }
      const _notify = new Notification(title, options);
      _notify.onshow = function(e) {
        return obs.next({
          notification: _notify,
          event: e
        });
      };
      _notify.onclick = function(e) {
        return obs.next({
          notification: _notify,
          event: e
        });
      };
      _notify.onerror = function(e) {
        return obs.error({
          notification: _notify,
          event: e
        });
      };
      _notify.onclose = function() {
        return obs.complete();
      };
    });
  }

  generateNotification(source: Array<any>): void {
    const self = this;
    source.forEach(item => {
      const options = {
        body: item.alertContent,
        icon: '../resource/images/bell-icon.png'
      };
      const notify = self.create(item.title, options).subscribe();
    });
  }

  setBubble(count: number) {
    this.tinycon.setBubble(count);
  }
}
export declare type Permission = 'denied' | 'granted' | 'default';
export interface PushNotification {
  body?: string;
  icon?: string;
  tag?: string;
  data?: any;
  renotify?: boolean;
  silent?: boolean;
  sound?: string;
  noscreen?: boolean;
  sticky?: boolean;
  dir?: 'auto' | 'ltr' | 'rtl';
  lang?: string;
  vibrate?: number[];
}
