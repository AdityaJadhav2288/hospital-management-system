import { apiClient } from "@/services/api-client";
import type { BloodStock } from "@/types/blood-stock";
import type { Department } from "@/types/department";
import type { HealthPackage } from "@/types/health-package";

export const adminPortalService = {
  getDepartments: (): Promise<Department[]> => apiClient.get<Department[]>("/admin/departments"),

  createDepartment: (payload: Pick<Department, "name" | "description" | "icon">): Promise<Department> =>
    apiClient.post<Department>("/admin/departments", payload),

  updateDepartment: (id: string, payload: Partial<Pick<Department, "name" | "description" | "icon">>): Promise<Department> =>
    apiClient.patch<Department>(`/admin/departments/${id}`, payload),

  deleteDepartment: (id: string): Promise<void> => apiClient.delete<void>(`/admin/departments/${id}`),

  getBloodStock: (): Promise<BloodStock[]> => apiClient.get<BloodStock[]>("/admin/blood-stock"),

  upsertBloodStock: (payload: { bloodGroup: BloodStock["bloodGroup"]; units: number }): Promise<BloodStock> =>
    apiClient.post<BloodStock>("/admin/blood-stock", payload),

  deleteBloodStock: (id: string): Promise<void> => apiClient.delete<void>(`/admin/blood-stock/${id}`),

  getPackages: (): Promise<HealthPackage[]> => apiClient.get<HealthPackage[]>("/admin/packages"),

  createPackage: (payload: Omit<HealthPackage, "id">): Promise<HealthPackage> => apiClient.post<HealthPackage>("/admin/packages", payload),

  updatePackage: (id: string, payload: Partial<Omit<HealthPackage, "id">>): Promise<HealthPackage> =>
    apiClient.patch<HealthPackage>(`/admin/packages/${id}`, payload),

  deletePackage: (id: string): Promise<void> => apiClient.delete<void>(`/admin/packages/${id}`),
};
