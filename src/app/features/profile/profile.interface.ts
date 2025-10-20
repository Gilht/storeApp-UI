export interface UserProfile {
  id: number;
  name: string;
  lastname: string;
  email: string;
  age: number;
  createdAt?: string;
  updatedAt?: string;
  roles?: Role[];
}

export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface UserProfileResponse {
  traceId: string;
  payload: {
    data: UserProfile;
  };
}
