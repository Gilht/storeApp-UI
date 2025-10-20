import { inject, Injectable } from '@angular/core';
import { environment } from '@envs/environment';
import { Observable } from 'rxjs';
import { APIService } from '@api/api.service';
import { UserProfileResponse } from './profile.interface';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly _apiService = inject(APIService);
  private readonly _endPoint = `${environment.API_URL_FAKE_STORE}/users`;

  getUserProfile(userId: number): Observable<UserProfileResponse> {
    return this._apiService.get<UserProfileResponse>(`${this._endPoint}/${userId}`);
  }

  getUserByEmail(email: string): Observable<UserProfileResponse> {
    return this._apiService.get<UserProfileResponse>(`${this._endPoint}/email/${email}`);
  }
}
