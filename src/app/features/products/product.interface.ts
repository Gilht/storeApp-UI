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

export interface ProductRequest {
  name: string;
  code: string;
  description: string;
  price: number;
  salePrice: number;
  category: number;
  brand: number; 
}

export interface Product {
  id: number;
  name: string;
  code: string;
  description: string;
  price: number;
  salePrice: number;
  imgUrl: string | null;
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
