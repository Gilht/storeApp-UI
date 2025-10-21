import { Component, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CategoryFilterComponent } from '@features/categories/category-filter/category-filter.component';
import { FooterComponent } from '@layout/footer/footer.component';
import { HeaderComponent } from '@layout/header/header.component';
import HeroComponent from '@layout/hero/hero.component';
import { SpinnerComponent } from '@shared/ui/spinner/spinner.component';
import { ChatbotComponent } from '@shared/ui/chatbot/chatbot.component';
import { filter } from 'rxjs';
import { CartStateService } from 'src/app/store/cart-state/cart-state.service';

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    HeroComponent,
    CategoryFilterComponent,
    SpinnerComponent,
    FooterComponent,
    ChatbotComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  currentRoute = signal('');
  readonly cart = inject(CartStateService).cart;

  private readonly _router = inject(Router);

  constructor() {
    this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute.set(event.urlAfterRedirects.slice(1));
      });
  }
}
