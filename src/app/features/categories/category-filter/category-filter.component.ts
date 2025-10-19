import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '@features/categories/categories.service';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [],
  styleUrl: './category-filter.component.scss',
  template: `
    <h2 class="heading">
      <span class="highlight">Popular</span>
      categories
    </h2>
    <ul class="list-container">
      <li>
        <button type="button" (click)="onClick('all')" class="btn btn-hover">
          {{ 'ALL' }}
        </button>
      </li>
      @for (category of categories$; track category) {
      <li>
        <button type="button" (click)="onClick(category)" class="btn btn-hover">
          {{ category }}
        </button>
      </li>
      }
    </ul>
  `,
})
export class CategoryFilterComponent implements OnInit {
  readonly categories$ = inject(CategoryService).categories$.value;
  ngOnInit(): void {
    // Component initialization logic can go here if needed
    console.log('CategoryFilterComponent initialized', this.categories$);
  }

  private readonly _router = inject(Router);

  onClick(category: string): void {
    this._router.navigate([], {
      queryParams: { category: category === 'all' ? null : category },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
