import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  get<T>(path: string, options = this.httpOptions): Observable<any> {
    return this.http.get<T>(`${environment.api}${path}`, options);
  }

  post<T>(
    path: string,
    body: Object = {},
    options = this.httpOptions
  ): Observable<any> {
    return this.http.post<T>(`${environment.api}${path}`, body, options);
  }

  put(
    path: string,
    body: Object = {},
    options = this.httpOptions
  ): Observable<any> {
    return this.http.put(`${environment.api}${path}`, body, options);
  }

  patch(
    path: string,
    body: Object = {},
    options = this.httpOptions
  ): Observable<any> {
    return this.http.patch(`${environment.api}${path}`, body, options);
  }

  delete(path, options = this.httpOptions): Observable<any> {
    return this.http.delete(`${environment.api}${path}`, options);
  }
}
