import { environment } from '@envs/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs'; 
import { ResultDto } from '@shared/models/result.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {
  private token!: string;
  private baseUrl: string;
  private loginSuccessSubject = new Subject<void>();
  public loginSuccess$ = this.loginSuccessSubject.asObservable();
  constructor(private http: HttpClient, private router: Router) {
    this.baseUrl = `${environment.API_URL_FAKE_STORE}`;
  }

  saveToken(token: string, refreshToken?: string) {
    localStorage.setItem("ACCESS_TOKEN_SHOPPING", token);
    if (refreshToken) {
      localStorage.setItem("REFRESH_TOKEN_SHOPPING", refreshToken);
    }

    this.token = token;
    this.loginSuccessSubject.next();
  }

  private getToken() {
    if (!this.token) {
      return localStorage.getItem("ACCESS_TOKEN_SHOPPING");
    }
    return this.token;
  }

  logout() {
    this.token = "";
    localStorage.removeItem("ACCESS_TOKEN_SHOPPING");
    localStorage.removeItem("REFRESH_TOKEN_SHOPPING");
    this.router.navigateByUrl("/");
  }

  getUserInfo() {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split(".")[1];
      return JSON.parse(window.atob(payload));
    } else {
      return null;
    }
  }

  isLogged() {
    const user = this.getUserInfo();
    if (!user) {
      return false;
    }
    return user ? user.exp > Date.now() / 1000 : false;
  }

  returnToken() {
    return this.isLogged() ? this.getToken() : null;
  }

  
  refreshToken(): Observable<ResultDto> {
    const refreshToken = localStorage.getItem("REFRESH_TOKEN_SHOP");
    return this.http.get<ResultDto>(`${this.baseUrl}/auth/get-new-access-token/${refreshToken}`);
  }

  getByEmail(email: string) {
    return this.http.get<ResultDto>(`${this.baseUrl}/auth/getEmail/${email}`);
  }


}
