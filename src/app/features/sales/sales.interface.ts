export interface SaleDetail {
  product: number | any;
  quantity: number;
  unitPrice: number;
}

export interface SaleRequest {
  user: string;
  saleNumber: string;
  discount: number;
  details: SaleDetail[];
}

export interface Sale {
  id: number;
  user: any;
  saleNumber: string;
  discount: number;
  total: number;
  createdAt: string;
  details: SaleDetail[];
}

export interface SalesResponse {
  traceId: string;
  payload: {
    data: Sale[];
    page: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  };
}
