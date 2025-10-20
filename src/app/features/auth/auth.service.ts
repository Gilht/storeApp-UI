import { inject, Injectable } from '@angular/core';
import { environment } from '@envs/environment';
import { Observable } from 'rxjs';
import { APIService } from '@api/api.service';
import { RegisterRequest } from './auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _apiService = inject(APIService);
  private readonly _endPoint = `${environment.API_URL_FAKE_STORE}/auth`;
  private readonly _endPointUser = `${environment.API_URL_FAKE_STORE}/users`;

  register(data: RegisterRequest): Observable<RegisterRequest> {
    return this._apiService.post<RegisterRequest>(`${this._endPointUser}`, data);
  }

  login(email: string, password: string): Observable<any> {
    return this._apiService.post<any>(`${this._endPoint}/login`, {
      email,
      password,
    });
  }
}
