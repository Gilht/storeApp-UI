import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

type AddToCartConfig = Record<'text', string>;

const DEFAULT_ADD_TO_CART_TEXT = 'Add to cart';

const defaultConfig: AddToCartConfig = {
  text: DEFAULT_ADD_TO_CART_TEXT,
} as const;

@Component({
  selector: 'app-add-to-cart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      (click)="onAddToCart()"
      class="whitespace-nowrap bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95">
      {{ config().text }}
    </button>
  `,
  styleUrl: './add-to-cart.component.scss',
})
export class AddToCartComponent {
  config = input<AddToCartConfig>(defaultConfig);
  addToCartEvent = output<void>();

  onAddToCart(): void {
    this.addToCartEvent.emit();
  }
}
