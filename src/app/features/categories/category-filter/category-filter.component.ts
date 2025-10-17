import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '@features/categories/categories.service';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [AsyncPipe],
  styleUrl: './category-filter.component.scss',
  template: `
    <h2 class="heading">
      <span class="highlight">Popular</span>
      categories
    </h2>
    <ul class="list-container">
      <!-- TODO: Can be an  component -->
      <li>
        <button type="button" (click)="onClick('all')" class="btn btn-hover">
          {{ 'ALL' }}
        </button>
      </li>
      <!-- TODO: Can be an  component -->
      @for (category of categories$ | async; track $index) {
      <li>
        <button type="button" (click)="onClick(category)" class="btn btn-hover">
          {{ category }}
        </button>
      </li>
      }
    </ul>
  `,
})
export class CategoryFilterComponent {
  readonly categories$ = inject(CategoryService).categories$;

  private readonly _router = inject(Router);

  onClick(category: string): void {
    this._router.navigate([], {
      queryParams: { category: category === 'all' ? null : category },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
