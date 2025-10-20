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
        title: 'Carrito vacío',
        text: 'No hay productos en el carrito para procesar',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    const userInfo = this._authService.getUserInfo();
    console.log('User Info:', userInfo);
    if (!userInfo) {
      await Swal.fire({
        icon: 'error',
        title: 'No autenticado',
        text: 'Debes iniciar sesión para realizar una compra',
        confirmButtonColor: '#3b82f6'
      });
      this._router.navigate(['/users/login']);
      return;
    }

    const result = await Swal.fire({
      title: '¿Confirmar compra?',
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Total de productos:</strong> ${this.cart()?.productsCount}</p>
          <p class="mb-2"><strong>Total a pagar:</strong> $${this.totalAmount()?.toFixed(2)}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
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
          title: '¡Compra exitosa!',
          html: `
            <div class="text-left">
              <p class="mb-2"><strong>Número de venta:</strong> ${saleNumber}</p>
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
          title: 'Error al procesar la compra',
          text: error.error?.message || 'Ha ocurrido un error al procesar tu compra',
          confirmButtonColor: '#3b82f6'
        });
      }
    });
  }

  async clearAll(): Promise<void> {
    const result = await Swal.fire({
      title: '¿Vaciar carrito?',
      text: 'Se eliminarán todos los productos del carrito',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      this.cartService.clearCart();
      await Swal.fire({
        icon: 'success',
        title: 'Carrito vaciado',
        text: 'Todos los productos han sido eliminados',
        confirmButtonColor: '#3b82f6',
        timer: 2000,
        showConfirmButton: false
      });
    }
  }

  async onRemoveProduct(productId: number): Promise<void> {
    const product = this.cart()?.products.find(p => p.id === productId);

    const result = await Swal.fire({
      title: '¿Eliminar producto?',
      text: `¿Deseas eliminar "${product?.name}" del carrito?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      this.cartService.removeFromCart(productId);
      await Swal.fire({
        icon: 'success',
        title: 'Producto eliminado',
        text: `"${product?.name}" ha sido eliminado del carrito`,
        confirmButtonColor: '#3b82f6',
        timer: 2000,
        showConfirmButton: false
      });
    }
  }
}
