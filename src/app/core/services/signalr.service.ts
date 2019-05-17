import { Notification, StatusBroadCast } from './../models/notification';
import { JwtService } from './jwt.service';
import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DossierCount } from '../models/dossier-count';

declare var $: any;
@Injectable({ providedIn: 'root' })
export class SignalRService {
  private proxy: any;
  private connection: any;
  public notificationReceived = new EventEmitter<Notification>();
  public statusBroadCast = new EventEmitter<StatusBroadCast>();
  public countBroadCast = new EventEmitter<DossierCount>();
  public devisBroadCast = new EventEmitter<any>();
  public missionDetailsBroadCast = new EventEmitter<any>();
  private timeout;
  timeCounter = 5;

  constructor(jwtSvc: JwtService) {
    this.connection = $.hubConnection(environment.api);
    // $.signalR.ajaxDefaults.headers = { Authorization: 'Bearer ' + jwtSvc.getToken() };
    this.proxy = this.connection.createHubProxy('NotificationHub');
    this.registerOnServerEvents();
    this.connection.qs = { token: jwtSvc.getToken() };
    this.startConnection();
    this.retryWhenDisconnected();
  }

  private startConnection(): void {
    this.connection
      .start({ withCredentials: false })
      .done((data: any) => {
        // console.log(
        //   'Connected ' + data.transport.name + ', connection ID= ' + data.id
        // );
      })
      .fail((error: any) => {
        console.log('Could not connect ' + error);
      });
  }

  retryWhenDisconnected() {
    this.connection.disconnected(() => {
      this.timeCounter =
        this.timeCounter < 30 ? this.timeCounter + 5 : this.timeCounter;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.startConnection();
      }, this.timeCounter * 1000);
    });
  }

  private registerOnServerEvents(): void {
    this.proxy.on('Notification', (notif: Notification) => {
      this.notificationReceived.emit(notif);
    });
    this.proxy.on('broadcastStatus', (notif: StatusBroadCast) => {
      this.statusBroadCast.emit(notif);
    });
    this.proxy.on('broadcastCount', (count: DossierCount) => {
      this.countBroadCast.emit(count);
    });
    this.proxy.on('broadcastDevis', (devis: any) => {
      this.devisBroadCast.emit(devis);
    });
    this.proxy.on('BroadCastMissionDetails', (mission: any) => {
      this.missionDetailsBroadCast.emit(mission);
    });
  }
}
