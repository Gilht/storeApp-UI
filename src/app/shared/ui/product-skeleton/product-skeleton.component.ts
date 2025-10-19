import { Component } from '@angular/core';

@Component({
  selector: 'app-product-skeleton',
  standalone: true,
  template: `
    <div class="product-card">
      <div class="w-[340px] h-[550px] overflow-hidden bg-white rounded-lg shadow-md flex flex-col animate-pulse">
        <!-- Image skeleton -->
        <div class="h-52 bg-gray-200"></div>

        <div class="px-5 py-5 flex flex-col gap-4 flex-grow">
          <!-- Category and Brand skeleton -->
          <div class="flex items-center gap-2">
            <div class="h-7 w-20 bg-gray-200 rounded-md"></div>
            <div class="h-7 w-20 bg-gray-200 rounded-md"></div>
          </div>

          <!-- Title skeleton -->
          <div class="space-y-2">
            <div class="h-5 bg-gray-200 rounded w-3/4"></div>
            <div class="h-5 bg-gray-200 rounded w-1/2"></div>
          </div>

          <!-- Code skeleton -->
          <div class="h-4 bg-gray-200 rounded w-1/3"></div>

          <!-- Description skeleton -->
          <div class="space-y-2 flex-grow">
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>

        <!-- Price and button skeleton -->
        <div class="px-5 pb-5 pt-2 border-t border-gray-100">
          <div class="flex items-center justify-between">
            <div class="h-8 w-24 bg-gray-200 rounded"></div>
            <div class="h-10 w-28 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProductSkeletonComponent {}
