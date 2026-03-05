export interface Department {
  id: string;
  name: string;
  description: string;
  icon?: string | null;
  _count?: {
    doctors: number;
  };
}
