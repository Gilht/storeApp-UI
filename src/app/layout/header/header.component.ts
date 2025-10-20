import { AuthStoreService } from './../../shared/services/auth-store.service';
import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from 'src/app/store/cart-state/cart-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  cart = input<CartStore | null>();
  showCart = signal(false);
  readonly auth = inject(AuthStoreService);

  isLoggedIn() {
    return this.auth.isLogged();
  }

  onLogout() {
    this.auth.logout();
  }
}
