import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:8080/api/reviews'; // Ensure the correct URL

  constructor(private http: HttpClient) {}

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken'); // Retrieve the token
  }
  
  getReviewsByAppId(appId: number): Observable<Review[]> {
    const token = this.getAuthToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  
    return this.http.get<Review[]>(`${this.apiUrl}/${appId}`, { headers });
  }
  
  addReview(appId: number, review: Review): Observable<Review> {
    const token = this.getAuthToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  
    return this.http.post<Review>(`${this.apiUrl}/${appId}`, review, { headers });
  }
}
