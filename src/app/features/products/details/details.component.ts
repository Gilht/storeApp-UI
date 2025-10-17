import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { Product } from '@features/products/product.interface';
import { ProductsService } from '@features/products/products.service';
import { CartStateService } from 'src/app/store/cart-state/cart-state.service';

import { STAR_SVG } from '@shared/constants/star-svg.constants';
import { AddToCartComponent } from '@shared/ui/add-to-cart/add-to-cart.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [AddToCartComponent, AsyncPipe, CurrencyPipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export default class DetailsComponent {
  starsArray: number[] = new Array(5).fill(0);
  product$!: Observable<Product | undefined>;

  private _productId!: number;
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _productSvc = inject(ProductsService);
  private readonly _sanitizer = inject(DomSanitizer);
  private readonly _cartService = inject(CartStateService);

  constructor() {
    this._activatedRoute.params.subscribe((params: Params) => {
      this._productId = params['id'];
      this.product$ = this._productSvc.getProductById(+this._productId);
    });
  }

  onAddToCart(product: Product): void {
    this._cartService.addToCart(product);
  }

  getStarSVG(starIndex: number, productRate: number): SafeHtml {
    if (starIndex + 1 <= Math.floor(productRate)) {
      return this._sanitizer.bypassSecurityTrustHtml(STAR_SVG.FULL);
    }

    if (starIndex < productRate) {
      return this._sanitizer.bypassSecurityTrustHtml(STAR_SVG.PARTIAL);
    }

    return this._sanitizer.bypassSecurityTrustHtml(STAR_SVG.EMPTY);
  }
}
