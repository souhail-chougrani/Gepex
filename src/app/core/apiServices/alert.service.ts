import { Injectable } from '@angular/core';
import { SnackbarService } from 'ngx-snackbar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private snackbarService: SnackbarService) {}
  get(): Observable<any> {
    return this.snackbarService.get();
  }

  alert(params: AlertParams): void {
    this.snackbarService.add({
      msg: params.msg,
      timeout: params.timeout || 3000,
      customClass: params.type || AlertTypes.Default,
      action: { ...params.action, color: '#040505' },
      onAdd: params.onAdd,
      onRemove: params.onRemove
    });
  }

  error(params: AlertParams) {
    this.alert({ ...params, type: AlertTypes.Error });
  }

  success(params: AlertParams) {
    this.alert({ ...params, type: AlertTypes.Success });
  }

  warn(params: AlertParams) {
    this.alert({ ...params, type: AlertTypes.Warn });
  }

  remove(id: string): void {
    this.snackbarService.remove(id);
  }

  clear(): void {
    this.snackbarService.clear();
  }
}

export interface AlertParams {
  msg: string;
  timeout?: number;
  type?: AlertTypes;
  action?: {
    text: string;
    onClick?: Function;
  };
  onAdd?: Function;
  onRemove?: Function;
}

export enum AlertTypes {
  'Default' = 'default',
  'Error' = 'error',
  'Warn' = 'warn',
  'Success' = 'success'
}
