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
  views?: number; // Number of views (optional if not required initially)
  recommended?: boolean; // Whether the app is recommended to be updated
  probability?: number; 
}