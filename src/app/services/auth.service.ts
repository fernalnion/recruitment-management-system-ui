import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAccessToken, IAccessTokenBody } from '../models/AccessToken';
import { IResponse } from '../models/Response';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken = 'authToken';
  constructor(
    private http: HttpClient,
    private readonly router: Router,
    private readonly jwtHelper: JwtHelperService
  ) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http
      .post<IResponse<IAccessToken>>(
        `${environment.API}/auth/login`,
        credentials
      )
      .pipe(map((data) => data.data));
  }

  setAuthToken(token: string): void {
    localStorage.setItem(this.accessToken, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessToken);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  logout(): void {
    localStorage.removeItem(this.accessToken);
    this.router.navigate(['/auth/login']);
  }

  register(user: {
    username: string;
    password: string;
    email: string;
  }): Observable<any> {
    return this.http.post(`${environment.API}/register`, user);
  }

  getCurrentUser(): IAccessTokenBody | null {
    const accessToken = this.getAccessToken();
    if (accessToken && !this.jwtHelper.isTokenExpired(accessToken)) {
      return this.jwtHelper.decodeToken(accessToken);
    } else {
      return null;
    }
  }
}
