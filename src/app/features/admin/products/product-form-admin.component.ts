import { ProductRequest } from './../../products/product.interface';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '@features/products/products.service';
import { CategoryService } from '@features/categories/categories.service';
import { Category, Brand, Product } from '@features/products/product.interface';
import { ToastrService } from 'ngx-toastr';
import { APIService } from '@api/api.service';
import { environment } from '@envs/environment';

@Component({
  selector: 'app-product-form-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form-admin.component.html',
})
export default class ProductFormAdminComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _productsService = inject(ProductsService);
  private readonly _categoryService = inject(CategoryService);
  private readonly _apiService = inject(APIService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _toastr = inject(ToastrService);

  readonly isLoading = signal(false);
  readonly isEditMode = signal(false);
  readonly productId = signal<number | null>(null);
  readonly categories = signal<Category[]>([]);
  readonly brands = signal<Brand[]>([]);

  productForm: FormGroup = this._fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    code: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: ['', [Validators.required, Validators.min(0)]],
    salePrice: ['', [Validators.required, Validators.min(0)]],
    active: [true],
    category: [null],
    brand: [null],
  });

  ngOnInit(): void {
    this.loadCategories();
    this.loadBrands();

    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productId.set(+id);
      this.loadProduct(+id);
    }
  }

  loadCategories(): void {
    this._apiService
      .get<any>(`${environment.API_URL_FAKE_STORE}/categories`)
      .subscribe({
        next: (response) => {
          this.categories.set(response.payload.data);
        },
        error: () => {
          this._toastr.error('Error al cargar categorías');
        },
      });
  }

  loadBrands(): void {
    this._apiService
      .get<any>(`${environment.API_URL_FAKE_STORE}/brands`)
      .subscribe({
        next: (response) => {
          this.brands.set(response.payload.data);
        },
        error: () => {
          this._toastr.error('Error al cargar marcas');
        },
      });
  }

  loadProduct(id: number): void {
    this.isLoading.set(true);
    this._productsService.getProductByIdFromApi(id).subscribe({
      next: (response) => {
        const product = response.payload.data;
        this.productForm.patchValue({
          name: product.name,
          code: product.code,
          description: product.description,
          price: product.price,
          salePrice: product.salePrice,
          active: product.active,
          category: product.category?.id || null,
          brand: product.brand?.id || null,
        });
        this.isLoading.set(false);
      },
      error: () => {
        this._toastr.error('Error al cargar el producto');
        this.isLoading.set(false);
        this._router.navigate(['/admin/products']);
      },
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isLoading.set(true);

      const formValue = this.productForm.value;
      const productData: ProductRequest = {
        name: formValue.name,
        code: formValue.code,
        description: formValue.description,
        price: parseFloat(formValue.price),
        salePrice: parseFloat(formValue.salePrice),
        active: formValue.active,
        category: formValue.category,
        brand: formValue.brand,
        id: 0
      };

      if (this.isEditMode()) {
        productData.id = this.productId()!;
        this._productsService
          .updateProduct(this.productId()!, productData)
          .subscribe({
            next: () => {
              this._toastr.success('Producto actualizado correctamente');
              this._router.navigate(['/admin/products']);
            },
            error: (error) => {
              this._toastr.error(
                error.error?.message || 'Error al actualizar el producto'
              );
              this.isLoading.set(false);
            },
          });
      } else {
        this._productsService.createProduct(productData).subscribe({
          next: () => {
            this._toastr.success('Producto creado correctamente');
            this._router.navigate(['/admin/products']);
          },
          error: (error) => {
            this._toastr.error(
              error.error?.message || 'Error al crear el producto'
            );
            this.isLoading.set(false);
          },
        });
      }
    } else {
      this.markFormGroupTouched(this.productForm);
    }
  }

  onCancel(): void {
    this._router.navigate(['/admin/products']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.productForm.get(fieldName);

    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }

    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }

    if (control?.hasError('min')) {
      return 'El valor debe ser mayor o igual a 0';
    }

    return '';
  }

  hasError(fieldName: string): boolean {
    const control = this.productForm.get(fieldName);
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }
}
