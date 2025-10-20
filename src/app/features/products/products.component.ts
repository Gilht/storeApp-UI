import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CartStateService } from 'src/app/store/cart-state/cart-state.service';

import { CardComponent } from '@features/products/card/card.component';
import { Product } from '@features/products/product.interface';
import { ProductsService } from '@features/products/products.service';
import { ProductSkeletonComponent } from '@shared/ui/product-skeleton/product-skeleton.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CardComponent, FormsModule, ProductSkeletonComponent],
  styleUrl: './products.component.scss',
  templateUrl: 'products.component.html',
})
export default class ProductsComponent {
  private readonly _route = inject(ActivatedRoute);
  readonly productsService = inject(ProductsService);
  private readonly _cartService = inject(CartStateService);

  readonly products = this.productsService.products;
  readonly currentPage = this.productsService.currentPage;
  readonly totalPages = this.productsService.totalPages;
  readonly totalProducts = this.productsService.totalProducts;
  readonly isLoading = this.productsService.isLoading;
  readonly searchTerm = signal('');

  private readonly queryParams = toSignal(this._route.queryParams);

  constructor() {
    // Cargamos los productos una sola vez al iniciar el componente
    this.productsService.loadProducts();

    // Monitoreamos cambios en los parámetros de la ruta para filtrar por categoría
    effect(() => {
      const params = this.queryParams();
      if (params && params['category']) {
        const category = params['category'];
        this.productsService.filterProductsByCategory(category);
      }
    }, { allowSignalWrites: true });
  }

  onAddToCart(product: Product): void {
    // Agregar producto al carrito sin verificar autenticación
    // La verificación se hará al momento de procesar el pago
    this._cartService.addToCart(product);
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.productsService.searchProducts(target.value);
  }

  onNextPage(): void {
    this.productsService.nextPage();
  }

  onPreviousPage(): void {
    this.productsService.previousPage();
  }

  onGoToPage(page: number): void {
    this.productsService.goToPage(page);
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    const start = Math.max(0, current - 2);
    const end = Math.min(total, current + 3);

    for (let i = start; i < end; i++) {
      pages.push(i);
    }

    return pages;
  }

  trackById(_index: number, product: Product): number {
    return product.id;
  }
}
