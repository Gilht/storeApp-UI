import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductsService } from '@features/products/products.service';
import { Product } from '@features/products/product.interface';
import { CurrencyPipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products-list-admin',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './products-list-admin.component.html',
})
export default class ProductsListAdminComponent implements OnInit {
  private readonly _productsService = inject(ProductsService);
  private readonly _router = inject(Router);

  readonly products = this._productsService.products;
  readonly isLoading = this._productsService.isLoading;
  readonly currentPage = this._productsService.currentPage;
  readonly totalPages = this._productsService.totalPages;

  ngOnInit(): void {
    this._productsService.loadProducts({ page: 0, pageSize: 20 });
  }

  async onDelete(productId: number, productName: string): Promise<void> {
    const result = await Swal.fire({
      title: 'Delete Product?',
      text: `Are you sure you want to delete "${productName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      this._productsService.deleteProduct(productId).subscribe({
        next: async () => {
          await Swal.fire({
            icon: 'success',
            title: 'Product Deleted',
            text: 'The product has been deleted successfully',
            confirmButtonColor: '#f97316'
          });
          this._productsService.loadProducts();
        },
        error: async (error) => {
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.message || 'Could not delete the product',
            confirmButtonColor: '#f97316'
          });
        }
      });
    }
  }

  onEdit(productId: number): void {
    this._router.navigate(['/admin/products/edit', productId]);
  }

  onNextPage(): void {
    this._productsService.nextPage();
  }

  onPreviousPage(): void {
    this._productsService.previousPage();
  }
}
