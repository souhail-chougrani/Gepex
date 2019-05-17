import { Injectable } from '@angular/core';
import { Token } from '../models/token';
import * as moment from 'moment';
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class JwtService {
  getDecodedToken(): Token {
    let decodedToken: any;
    try {
      decodedToken = jwt_decode(localStorage.getItem('token'));
      return decodedToken;
      // valid token format
    } catch (error) {
      // invalid token format
      return null;
    }
  }

  getToken() {
    return localStorage.getItem('token');
  }

  saveToken(token: any) {
    localStorage.setItem('token', token);
  }

  destroyToken() {
    // localStorage.removeItem('token');
    localStorage.clear();
  }

  // Expires
  getExpiresTime() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
  setRefreshToken(token: Token) {
    const expiresAt = moment().add(token.expires_in - 24 * 60 * 60, 'second');
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  destroyRefreshToken() {
    localStorage.removeItem('expires_at');
  }
}
