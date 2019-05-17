import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  localStorageObservable: Observable<any>;
  tokenStorage: Observable<any>;
  constructor() {
    // this.initObservable();
    // this.localStorageObservable.subscribe(e => {
    //   console.warn(e.key, ' storage event from local');
    //   localStorage.removeItem(e.key);
    // });
  }
  initObservable() {
    this.localStorageObservable = fromEvent(window, 'storage').pipe(
      filter((e: any) => e.key !== 'token' && e.key !== 'ruulzIndex')
    );
    this.tokenStorage = fromEvent(window, 'storage').pipe(
      filter((e: any) => e.key === 'token')
    );
  }
}
