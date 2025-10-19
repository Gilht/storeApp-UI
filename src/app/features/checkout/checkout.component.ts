import { CurrencyPipe, SlicePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CheckoutService } from '@features/checkout/checkout.service';
import { CartStateService } from 'src/app/store/cart-state/cart-state.service';

import { RemoveProductComponent } from '@shared/ui/remove/remove-product.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    RemoveProductComponent,
    SlicePipe,
    CurrencyPipe,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export default class CheckoutComponent {
  readonly cartService = inject(CartStateService);
  private readonly _checkoutSvc = inject(CheckoutService);

  readonly cart = this.cartService.cart;
  readonly products = this.cartService.products;
  readonly totalAmount = this.cartService.totalAmount;

  onProceedToPay(): void {
    this._checkoutSvc.processPay(this.cart());
  }

  clearAll(): void {
    this.cartService.clearCart();
  }

  onRemoveProduct(productId: number): void {
    this.cartService.removeFromCart(productId);
  }
}
