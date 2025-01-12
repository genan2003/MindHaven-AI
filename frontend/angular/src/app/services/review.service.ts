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

  getLoggedInUser(): Observable<any> {
    const token = this.getAuthToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    return this.http.get<any>(`${this.apiUrl}/me`, {headers});
  }

  hasUserReviewed(appId: number): Observable<boolean> {
    const token = this.getAuthToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  
    return this.http.get<boolean>(`${this.apiUrl}/${appId}/has-reviewed`, { headers });
  }
  
  
  getReviewsByAppId(appId: number, loggedInUserId: number): Observable<Review[]> {
    const token = this.getAuthToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  
    return this.http.get<Review[]>(`${this.apiUrl}/${appId}?loggedInUserId=${loggedInUserId}`, { headers });
  }
  
  addReview(appId: number, review: Review): Observable<Review> {
    const token = this.getAuthToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  
    return this.http.post<Review>(`${this.apiUrl}/${appId}`, review, { headers });
  }

  deleteReview(reviewId: number): Observable<void> {
    const token = this.getAuthToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  
    return this.http.delete<void>(`${this.apiUrl}/${reviewId}`, { headers });
  }
  
}
