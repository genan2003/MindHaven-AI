export interface Review {
    reviewId?: number;
    appId: number;
    userId?: number;
    rating: number;
    reviewText: string;
    createdAt?: string;
  }