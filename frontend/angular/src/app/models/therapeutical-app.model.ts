export interface TherapeuticalApp {
  id?: number;
  name?: string;
  ageGroup?: string;
  description?: string;
  developer?: string;
  rating?: number;
  isTrending?: boolean;
  createdAt?: string;
  updatedAt?: string;
  mentalHealthDisorder?:string;
}