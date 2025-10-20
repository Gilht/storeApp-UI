import { inject, Injectable } from '@angular/core';
import { environment } from '@envs/environment';
import { Observable } from 'rxjs';
import { APIService } from '@api/api.service';
import { SaleRequest, SalesResponse, Sale } from './sales.interface';

@Injectable({ providedIn: 'root' })
export class SalesService {
  private readonly _apiService = inject(APIService);
  private readonly _endPoint = `${environment.API_URL_FAKE_STORE}/sales`;

  processSale(saleData: SaleRequest): Observable<SaleRequest> {
    return this._apiService.post<SaleRequest>(this._endPoint, saleData);
  }

  getAllSales(page: number = 0, pageSize: number = 10): Observable<SalesResponse> {
    return this._apiService.get<SalesResponse>(`${this._endPoint}/page?page=${page}&pageSize=${pageSize}`);
  }

  getSaleById(saleId: number): Observable<any> {
    return this._apiService.get<any>(`${this._endPoint}/${saleId}`);
  }

  deleteSale(saleId: number): Observable<any> {
    return this._apiService.delete<any>(`${this._endPoint}/${saleId}`);
  }
}
