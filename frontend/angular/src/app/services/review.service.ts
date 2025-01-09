import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:8080/api/reviews'; // Update with your backend API endpoint

  constructor(private http: HttpClient) {}

  getReviewsByAppId(appId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/app/${appId}`);
  }

  addReview(appId: number, review: Review): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/app/${appId}`, review);
  }
}
