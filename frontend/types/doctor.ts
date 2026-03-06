export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  experienceYears: number;
  phone: string;
  department: string;
  profileImage: string;
  bio?: string | null;
  demoPassword?: string;
  createdAt?: string;
  updatedAt?: string;
}
