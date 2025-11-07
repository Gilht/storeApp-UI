import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesService } from '@features/sales/sales.service';
import { Sale } from '@features/sales/sales.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sales-list-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-list-admin.component.html',
})
export default class SalesListAdminComponent implements OnInit {
  private readonly _salesService = inject(SalesService);

  readonly sales = signal<Sale[]>([]);
  readonly isLoading = signal(true);
  readonly currentPage = signal(0);
  readonly pageSize = signal(10);
  readonly totalElements = signal(0);
  readonly totalPages = computed(() => Math.ceil(this.totalElements() / this.pageSize()));

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.isLoading.set(true);
    this._salesService.getAllSales(this.currentPage(), this.pageSize()).subscribe({
      next: (response) => {
        this.sales.set(response.payload.data);
        this.totalElements.set(response.payload.totalElements);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  async onDelete(saleId: number, saleNumber: string): Promise<void> {
    const result = await Swal.fire({
      title: '¿Eliminar venta?',
      text: `¿Estás seguro de eliminar la venta "${saleNumber}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      this._salesService.deleteSale(saleId).subscribe({
        next: async () => {
          await Swal.fire({
            icon: 'success',
            title: 'Venta eliminada',
            confirmButtonColor: '#f97316'
          });
          this.loadSales();
        },
        error: async (error) => {
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.message || 'No se pudo eliminar la venta',
            confirmButtonColor: '#f97316'
          });
        }
      });
    }
  }

  async onViewDetails(sale: Sale): Promise<void> {
    const detailsHtml = sale.details.map((detail) => `
      <div class="flex justify-between py-2 border-b">
        <span>Producto ID: ${detail.product.name} - ${detail.product.code}</span>
        <span>Cantidad: ${detail.quantity}</span>
        <span>Precio: $${detail.unitPrice}</span>
      </div>
    `).join('');

    await Swal.fire({
      title: `Sale Details #${sale.saleNumber}`,
      html: `
        <div class="text-left">
          <div class="mb-4">
            <p><strong>User:</strong> ${sale.user.name} - ${sale.user.email}</p>
            <p><strong>Disscount:</strong> ${sale.discount}%</p>
            <p><strong>Total:</strong> $${sale.total}</p>
            <p><strong>Date:</strong> ${new Date(sale.createdAt).toLocaleDateString('es-ES')}</p>
          </div>
          <div class="mt-4">
            <h4 class="font-semibold mb-2">Products:</h4>
            ${detailsHtml}
          </div>
        </div>
      `,
      width: '600px',
      confirmButtonColor: '#f97316'
    });
  }

  onPreviousPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadSales();
    }
  }

  onNextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadSales();
    }
  }
}
