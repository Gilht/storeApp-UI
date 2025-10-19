export interface Category {
  id: number;
  name: string;
  active: boolean;
}

export interface Brand {
  id: number;
  name: string;
  active: boolean;
}

export interface Product {
  id: number;
  name: string;
  code: string;
  description: string;
  price: string;
  salePrice: string;
  active: boolean;
  category: Category | null;
  brand: Brand | null;
  quantity?: number;
  subTotal?: number;
  isDesired?: boolean;
}

export interface ProductsResponse {
  traceId: string;
  payload: {
    data: Product[];
    total: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
  };
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
  category?: string;
}
