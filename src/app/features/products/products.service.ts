import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@envs/environment';

import { PaginationParams, Product, ProductRequest, ProductsResponse } from '@features/products/product.interface';
import { map, Observable, tap } from 'rxjs';
import { APIService } from './../../api/api.service';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly _apiService = inject(APIService);
  private readonly _endPoint = `${environment.API_URL_FAKE_STORE}/products`;

  private readonly _allProducts = signal<Product[]>([]);
  private readonly _totalProducts = signal<number>(0);
  private readonly _currentPage = signal<number>(0);
  private readonly _pageSize = signal<number>(12);
  private readonly _searchTerm = signal<string>('');
  private readonly _categoryFilter = signal<string>('all');
  private readonly _isLoading = signal<boolean>(false);

  readonly products = this._allProducts.asReadonly();
  readonly totalProducts = this._totalProducts.asReadonly();
  readonly currentPage = this._currentPage.asReadonly();
  readonly pageSize = this._pageSize.asReadonly();
  readonly searchTerm = this._searchTerm.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  readonly totalPages = computed(() =>
    Math.ceil(this._totalProducts() / this._pageSize())
  );

  constructor() {
    this.loadProducts();
  }

  loadProducts(params?: Partial<PaginationParams>): void {
    const page = params?.page ?? this._currentPage();
    const pageSize = params?.pageSize ?? this._pageSize();
    const search = params?.search ?? this._searchTerm();
    const category = params?.category ?? (this._categoryFilter() !== 'all' ? this._categoryFilter() : undefined);

    let url = `${this._endPoint}/page?page=${page}&pageSize=${pageSize}`;

    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }

    this._isLoading.set(true);

    this._apiService
      .get<ProductsResponse>(url)
      .pipe(
        tap((response: ProductsResponse) => {
          const products = this._addProperties(response.payload.data);
          this._allProducts.set(products);
          this._totalProducts.set(response.payload.total);
          this._currentPage.set(page);
          this._pageSize.set(pageSize);
          if (search !== undefined) this._searchTerm.set(search);
          if (category) this._categoryFilter.set(category);
          this._isLoading.set(false);
        })
      )
      .subscribe({
        error: () => {
          this._isLoading.set(false);
        }
      });
  }

  getProductById(productId: number): Observable<Product | undefined> {
    return new Observable((observer) => {
      const product = this._allProducts().find((product) => product.id === productId);
      observer.next(product);
      observer.complete();
    });
  }

  filterProductsByCategory(category: string): void {
    this._categoryFilter.set(category);
    this.loadProducts({ page: 0, category: category !== 'all' ? category : undefined });
  }

  searchProducts(searchTerm: string): void {
    this._searchTerm.set(searchTerm);
    this.loadProducts({ page: 0, search: searchTerm });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.loadProducts({ page });
    }
  }

  nextPage(): void {
    this.goToPage(this._currentPage() + 1);
  }

  previousPage(): void {
    this.goToPage(this._currentPage() - 1);
  }

  private _addProperties(products: Product[]): Product[] {
    return products.map((product) => ({
      ...product,
      quantity: 0,
    }));
  }

  // CRUD Methods for Admin
  createProduct(product: ProductRequest): Observable<ProductRequest> {
    return this._apiService.post<ProductRequest>(this._endPoint, product);
  }

  updateProduct(productId: number, product: ProductRequest): Observable<ProductRequest> {
    return this._apiService.put<ProductRequest>(`${this._endPoint}/${productId}`, product);
  }

  deleteProduct(productId: number): Observable<any> {
    return this._apiService.delete<any>(`${this._endPoint}/${productId}`);
  }

  getProductByIdFromApi(productId: number): Observable<any> {
    return this._apiService.get<any>(`${this._endPoint}/${productId}`);
  }
}
