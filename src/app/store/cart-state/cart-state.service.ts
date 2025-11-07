import { computed, effect, inject, Injectable, signal } from '@angular/core';
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

const CART_STORAGE_KEY = 'DEV_STORE_CART';

@Injectable({ providedIn: 'root' })
export class CartStateService {
  private readonly _cartCalculatorService = inject(CartCalculatorService);
  private readonly _toastrService = inject(ToastrService);

  private readonly _cartState = signal<CartStore>(this.loadCartFromStorage());

  // Señales públicas computadas para acceso de solo lectura
  readonly cart = this._cartState.asReadonly();
  readonly products = computed(() => this._cartState().products);
  readonly totalAmount = computed(() => this._cartState().totalAmount);
  readonly productsCount = computed(() => this._cartState().productsCount);

  constructor() {
    // Efecto para guardar el carrito en localStorage cada vez que cambie
    effect(() => {
      const currentCart = this._cartState();
      this.saveCartToStorage(currentCart);
    });
  }

  private loadCartFromStorage(): CartStore {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        return {
          products: parsedCart.products || [],
          totalAmount: parsedCart.totalAmount || 0,
          productsCount: parsedCart.productsCount || 0,
        };
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    return initialCartState;
  }

  private saveCartToStorage(cart: CartStore): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

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

    this._toastrService.success('Product added!!', 'DEV STORE');
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

    this._toastrService.success('Product removed!!', 'DEV STORE');
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentState = this._cartState();
    const updatedProducts = currentState.products.map((p) =>
      p.id === productId ? { ...p, quantity } : p
    );

    this._cartState.set({
      products: updatedProducts,
      totalAmount: this._cartCalculatorService.calculateTotal(updatedProducts),
      productsCount: this._cartCalculatorService.calculateItemsCount(updatedProducts),
    });

    this._toastrService.success('Quantity updated!', 'DEV STORE');
  }

  clearCart(): void {
    this._cartState.set(initialCartState);
    this._toastrService.success('All Products removed!', 'DEV STORE');
  }
}
