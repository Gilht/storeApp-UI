import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { CartStore } from 'src/app/store/cart-state/cart-state.service';

export const PaymentStatus_COMPLETED = 'COMPLETED';
export const PaymentStatus_FAILED = 'FAILED';
export const PaymentStatus_PENDING = 'PENDING';
export const PaymentStatus_CANCELLED = 'CANCELLED';

export const ALL_PAYMENT_STATUSES = [
  PaymentStatus_COMPLETED,
  PaymentStatus_FAILED,
  PaymentStatus_PENDING,
  PaymentStatus_CANCELLED,
] as const;

export type PaymentStatus = (typeof ALL_PAYMENT_STATUSES)[number];
// same as type PaymentStatus = 'COMPLETED' | 'FAILED' | 'PENDING' | 'CANCELLED'

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
  timestamp: Date;
  amount: number;
  status: PaymentStatus;
}

export interface PaymentProcessor {
  processPay(cart: Signal<CartStore>): Signal<PaymentResult>;
}
