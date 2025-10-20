import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { CheckoutService } from '@features/checkout/checkout.service';
import { CartStateService } from 'src/app/store/cart-state/cart-state.service';
import { RemoveProductComponent } from '@shared/ui/remove/remove-product.component';
import { SalesService } from '@features/sales/sales.service';
import { SaleRequest, SaleDetail } from '@features/sales/sales.interface';
import { AuthStoreService } from '@shared/services/auth-store.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    RemoveProductComponent,
    CurrencyPipe,
    RouterLink,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export default class CheckoutComponent {
  readonly cartService = inject(CartStateService);
  private readonly _checkoutSvc = inject(CheckoutService);
  private readonly _salesService = inject(SalesService);
  private readonly _authService = inject(AuthStoreService);
  private readonly _router = inject(Router);

  readonly cart = this.cartService.cart;
  readonly products = this.cartService.products;
  readonly totalAmount = this.cartService.totalAmount;
  readonly isProcessing = signal(false);

  async onProceedToPay(): Promise<void> {
    if (!this.cart()?.products || this.cart()?.products.length === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'Empty Cart',
        text: 'There are no products in the cart to process',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    const userInfo = this._authService.getUserInfo();
    console.log('User Info:', userInfo);
    if (!userInfo) {
      await Swal.fire({
        icon: 'error',
        title: 'Not Authenticated',
        text: 'You must sign in to make a purchase',
        confirmButtonColor: '#3b82f6'
      });
      this._router.navigate(['/users/login']);
      return;
    }

    const result = await Swal.fire({
      title: 'Confirm Purchase?',
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Total products:</strong> ${this.cart()?.productsCount}</p>
          <p class="mb-2"><strong>Total to pay:</strong> $${this.totalAmount()?.toFixed(2)}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, confirm',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      this.processPurchase(userInfo.email);
    }
  }

  private processPurchase(userId: string): void {
    this.isProcessing.set(true);

    const saleNumber = `SALE-${Date.now()}`;
    const details: SaleDetail[] = this.cart()?.products.map(product => ({
      product: product.id,
      quantity: product.quantity || 1,
      unitPrice: product.price
    })) || [];

    const saleRequest: SaleRequest = {
      user: userId,
      saleNumber: saleNumber,
      discount: 0,
      details: details
    };

    this._salesService.processSale(saleRequest).subscribe({
      next: async (response) => {
        console.log('Sale processed successfully:', response);
        this.isProcessing.set(false);
        await Swal.fire({
          icon: 'success',
          title: 'Purchase Successful!',
          html: `
            <div class="text-left">
              <p class="mb-2"><strong>Sale Number:</strong> ${saleNumber}</p>
              <p class="mb-2"><strong>Total:</strong> $${ details.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0).toFixed(2) }</p>
            </div>
          `,
          confirmButtonColor: '#3b82f6'
        });
        this.cartService.clearCart();
        this._router.navigate(['/products']);
      },
      error: async (error) => {
        this.isProcessing.set(false);
        await Swal.fire({
          icon: 'error',
          title: 'Error Processing Purchase',
          text: error.error?.message || 'An error occurred while processing your purchase',
          confirmButtonColor: '#3b82f6'
        });
      }
    });
  }

  async clearAll(): Promise<void> {
    const result = await Swal.fire({
      title: 'Empty Cart?',
      text: 'All products will be removed from the cart',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, empty',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      this.cartService.clearCart();
      await Swal.fire({
        icon: 'success',
        title: 'Cart Emptied',
        text: 'All products have been removed',
        confirmButtonColor: '#3b82f6',
        timer: 2000,
        showConfirmButton: false
      });
    }
  }

  async onRemoveProduct(productId: number): Promise<void> {
    const product = this.cart()?.products.find(p => p.id === productId);

    const result = await Swal.fire({
      title: 'Remove Product?',
      text: `Do you want to remove "${product?.name}" from the cart?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      this.cartService.removeFromCart(productId);
      await Swal.fire({
        icon: 'success',
        title: 'Product Removed',
        text: `"${product?.name}" has been removed from the cart`,
        confirmButtonColor: '#3b82f6',
        timer: 2000,
        showConfirmButton: false
      });
    }
  }

  onIncreaseQuantity(productId: number): void {
    const product = this.cart()?.products.find(p => p.id === productId);
    if (product) {
      this.cartService.updateQuantity(productId, (product.quantity || 0) + 1);
    }
  }

  onDecreaseQuantity(productId: number): void {
    const product = this.cart()?.products.find(p => p.id === productId);
    if (product && product.quantity && product.quantity > 1) {
      this.cartService.updateQuantity(productId, product.quantity - 1);
    }
  }

  onQuantityChange(productId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const newQuantity = parseInt(input.value, 10);

    if (!isNaN(newQuantity) && newQuantity > 0) {
      this.cartService.updateQuantity(productId, newQuantity);
    } else if (newQuantity === 0) {
      input.value = '1';
      this.cartService.updateQuantity(productId, 1);
    }
  }
}
