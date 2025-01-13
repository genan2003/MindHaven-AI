export interface Review {
    reviewId?: number;
    appId: number;
    userId?: number;
    username: string;
    rating: number;
    reviewText: string;
    createdAt?: string;
  }