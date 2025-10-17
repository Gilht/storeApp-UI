import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartStateService } from 'src/app/store/cart-state/cart-state.service';

import { CardComponent } from '@features/products/card/card.component';
import { Product } from '@features/products/product.interface';
import { ProductsService } from '@features/products/products.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CardComponent, AsyncPipe],
  styleUrl: './products.component.scss',
  templateUrl: 'products.component.html',
})
export default class ProductsComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _productsService = inject(ProductsService);
  private readonly _cartService = inject(CartStateService);

  products$ = this._productsService.products$;

  ngOnInit() {
    this._route.queryParams.subscribe((params) => {
      const category = params['category'] || 'all';
      this._productsService.filterProductsByCategory(category);
    });
  }

  onAddToCart(product: Product): void {
    this._cartService.addToCart(product);
  }
}
