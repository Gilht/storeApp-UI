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
  private readonly _products = signal<Product[]>([]);

  private readonly _cartCalculatorService = inject(CartCalculatorService);
  private readonly _toastrService = inject(ToastrService);


  readonly totalAmount = computed(() => 
    this._cartCalculatorService.calculateTotal(this._products())
  );

  readonly productsCount = computed(() => 
  this._cartCalculatorService.calculateItemsCount(this._products())
  );

  readonly cartStore = computed(() => ({
    products: this._products(),
    totalAmount: this.totalAmount(),
    productsCount: this.productsCount()
  }));
  
  readonly isCartEmpty = computed(() => this._products().length === 0);

  readonly mostExpensiveProduct = computed(() => {
    const products = this._products();
    if (products.length === 0) return null;

    return products.reduce((prev, curr) =>
      (prev.price || 0) > (curr.price || 0) ? prev : curr
    );
  });


  addToCart(product: Product): void {

    const currentProducts = this._products();

    const existingProductIndex =  currentProducts.findIndex(
      (p: Product) => p.id === product.id
    );
    if (existingProductIndex >= 0) {
      currentProducts[existingProductIndex] = {
        ...product,
        quantity: (currentProducts[existingProductIndex].quantity || 0) + 1,
      };
      this._products.set(currentProducts);
    } else {
      this._products.update((products: Product[]) => [
        ...products,
        {...product, quantity: 1}
      ])
    }

    this._toastrService.success('Product added!!', 'DOMINI STORE');
  }

  removeFromCart(productId: number): void {

    try {
      if(!productId) {
        throw new Error('Invalid product ID')
      }
      const currentProducts = this._products();
      const productExist = currentProducts.some((product: Product) => product.id === productId);

      if(!productExist) {
        this._toastrService.warning('Product not found');
        return;
      }
    
      this._products.update((products: Product[]) => 
      products.filter((product: Product) => product.id !== productId)
      );
      this._toastrService.success('Product removed!!', 'DOMINI STORE');
    } catch (error) {
      console.error('Error removing item', error);
      this._toastrService.success('Error removing product', 'DOMINI STORE');
    }
  }

  clearCart(): void {
    this._products.set([]);
    this._toastrService.success('All Products removed!', 'DOMINI STORE');
  }
}
