import { Category } from './../products/product.interface';
import { ResultDto } from './../../shared/models/result.dto';
import { inject, Injectable } from '@angular/core';
import { APIService } from '@api/api.service';
import { environment } from '@envs/environment';
import { tap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  readonly categories$ = new BehaviorSubject<string[]>([]);
  private readonly _endPoint = `${environment.API_URL_FAKE_STORE}/categories`;
  private readonly _apiService = inject(APIService);

  constructor() {
    this._getCategories();
  }

  private _getCategories(): void {
    this._apiService
      .get<ResultDto>(this._endPoint)
      .pipe(tap((result: ResultDto) => {
        const nameCategory = result.payload.data.map((category: Category) => category.name);
        this.categories$.next(nameCategory);
      }))
      .subscribe();
  }
}
