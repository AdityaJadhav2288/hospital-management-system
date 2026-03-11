export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  password?: string;
  dateOfBirth?: string;
  gender?: string;
  createdAt?: string;
  updatedAt?: string;
}
