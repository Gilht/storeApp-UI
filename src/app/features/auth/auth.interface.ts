export interface RegisterRequest {
  name: string;
  lastname: string;
  password: string;
  age: number;
  email: string;
  roles: number[];
}

export interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  age: number;
  roles: Role[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Role {
  id: number;
  name: string;
}
