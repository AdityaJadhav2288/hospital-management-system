export interface BloodStock {
  id: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  units: number;
  lastUpdated: string;
}
