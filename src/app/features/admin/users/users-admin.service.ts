import { inject, Injectable } from '@angular/core';
import { environment } from '@envs/environment';
import { Observable } from 'rxjs';
import { APIService } from '@api/api.service';

export interface UserAdmin {
  id: number;
  name: string;
  lastname: string;
  email: string;
  age: number;
  active: boolean;
  roles: any[];
}

export interface UsersResponse {
  traceId: string;
  payload: {
    data: UserAdmin[];
    total: number;
  };
}

@Injectable({ providedIn: 'root' })
export class UsersAdminService {
  private readonly _apiService = inject(APIService);
  private readonly _endPoint = `${environment.API_URL_FAKE_STORE}/users`;

  getAllUsers(page: number = 0, pageSize: number = 10): Observable<UsersResponse> {
    return this._apiService.get<UsersResponse>(`${this._endPoint}/page?page=${page}&pageSize=${pageSize}`);
  }

  getUserById(userId: number): Observable<any> {
    return this._apiService.get<any>(`${this._endPoint}/${userId}`);
  }

  createUser(user: Partial<UserAdmin>): Observable<any> {
    return this._apiService.post<any>(this._endPoint, user);
  }

  updateUser(userId: number, user: Partial<UserAdmin>): Observable<any> {
    return this._apiService.put<any>(`${this._endPoint}/${userId}`, user);
  }

  deleteUser(userId: number): Observable<any> {
    return this._apiService.delete<any>(`${this._endPoint}/${userId}`);
  }
}
