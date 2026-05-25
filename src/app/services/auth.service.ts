import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import { Observable } from 'rxjs';

import {
  LoginRequest
} from '../models/login';

import {
  LoginResponse
} from '../models/login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api =
    'https://localhost:7192/api/auth';

  constructor(
    private http: HttpClient
  ) {}

  login(
    request: LoginRequest
  ): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.api}/login`,
      request
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  guardarSesion(
    response: LoginResponse
  ): void {

    localStorage.setItem(
      'token',
      response.token
    );

    localStorage.setItem(
      'username',
      response.username
    );

    localStorage.setItem(
      'rol',
      response.rol
    );
  }

  cerrarSesion(): void {

    localStorage.clear();
  }

  estaLogueado(): boolean {

    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }
}