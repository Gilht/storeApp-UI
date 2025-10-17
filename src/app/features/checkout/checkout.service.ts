import { Injectable, Signal } from '@angular/core';
import {
  PaymentProcessor,
  PaymentResult,
} from '@features/checkout/checkout.interface';
import { CartStore } from 'src/app/store/cart-state/cart-state.service';


@Injectable({ providedIn: 'root' })
export class CheckoutService implements PaymentProcessor {
  processPay(cart: Signal<CartStore>): Signal<PaymentResult> {
    console.warn('Method not implemented.', cart);
    throw new Error('Method not implemented.');
  }
}
