import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Product } from '@features/products/product.interface';
import { ProductsService } from '@features/products/products.service';
import { CartStateService } from 'src/app/store/cart-state/cart-state.service';

import { AddToCartComponent } from '@shared/ui/add-to-cart/add-to-cart.component';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [AddToCartComponent, CurrencyPipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export default class DetailsComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _productSvc = inject(ProductsService);
  private readonly _cartService = inject(CartStateService);

  private readonly _productId = toSignal(
    this._activatedRoute.params.pipe(
      switchMap((params) => this._productSvc.getProductById(+params['id']))
    )
  );

  readonly product: Signal<Product | undefined> = computed(() => this._productId());

  onAddToCart(product: Product): void {
    this._cartService.addToCart(product);
  }
}
