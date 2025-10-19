import { computed, inject, Injectable, signal } from '@angular/core';
import { Product } from '@features/products/product.interface';
import { ToastrService } from 'ngx-toastr';
import { CartCalculatorService } from 'src/app/store/cart-state/cart-calculator.service';

export interface CartStore {
  products: Product[];
  totalAmount: number;
  productsCount: number;
}

export const initialCartState: CartStore = {
  products: [],
  totalAmount: 0,
  productsCount: 0,
};

@Injectable({ providedIn: 'root' })
export class CartStateService {
  private readonly _cartCalculatorService = inject(CartCalculatorService);
  private readonly _toastrService = inject(ToastrService);

  private readonly _cartState = signal<CartStore>(initialCartState);

  // Señales públicas computadas para acceso de solo lectura
  readonly cart = this._cartState.asReadonly();
  readonly products = computed(() => this._cartState().products);
  readonly totalAmount = computed(() => this._cartState().totalAmount);
  readonly productsCount = computed(() => this._cartState().productsCount);

  addToCart(product: Product): void {
    const currentState = this._cartState();
    const updatedProducts = [...currentState.products];
    const existingProductIndex = updatedProducts.findIndex(
      (p) => p.id === product.id
    );

    if (existingProductIndex >= 0) {
      updatedProducts[existingProductIndex] = {
        ...product,
        quantity: (updatedProducts[existingProductIndex].quantity || 0) + 1,
      };
    } else {
      updatedProducts.push({ ...product, quantity: 1 });
    }

    this._cartState.set({
      products: updatedProducts,
      totalAmount: this._cartCalculatorService.calculateTotal(updatedProducts),
      productsCount: this._cartCalculatorService.calculateItemsCount(updatedProducts),
    });

    this._toastrService.success('Product added!!', 'DOMINI STORE');
  }

  removeFromCart(productId: number): void {
    const currentState = this._cartState();
    const updatedProducts = currentState.products.filter(
      (p) => p.id !== productId
    );

    this._cartState.set({
      products: updatedProducts,
      totalAmount: this._cartCalculatorService.calculateTotal(updatedProducts),
      productsCount: this._cartCalculatorService.calculateItemsCount(updatedProducts),
    });

    this._toastrService.success('Product removed!!', 'DOMINI STORE');
  }

  clearCart(): void {
    this._cartState.set(initialCartState);
    this._toastrService.success('All Products removed!', 'DOMINI STORE');
  }
}
