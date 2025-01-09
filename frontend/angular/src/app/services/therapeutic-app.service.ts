import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TherapeuticalApp } from '../models/therapeutical-app.model';

@Injectable({
  providedIn: 'root'
})
export class TherapeuticAppService {
  private apiUrl = 'http://localhost:8080/api/apps'; // Ensure the correct URL

  constructor(private http: HttpClient) {}

  // Helper method to get the token (this will depend on your authentication method)
  private getAuthToken(): string | null {
    // Assuming the token is stored in localStorage (or it could be sessionStorage, etc.)
    return localStorage.getItem('authToken');  // Replace 'authToken' with your key
  }

  // Method to get all apps with Authorization header
  getApps(): Observable<TherapeuticalApp[]> {
    const token = this.getAuthToken();  // Get the token

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      
      // Send the request with the Authorization header
      return this.http.get<TherapeuticalApp[]>(this.apiUrl, { headers });
    } else {
      // Handle the case when there's no token (e.g., throw an error or return empty array)
      return this.http.get<TherapeuticalApp[]>(this.apiUrl);
    }
  }

  // Method to get a single app by ID with Authorization header
  getAppById(appId: number): Observable<TherapeuticalApp> {
    const token = this.getAuthToken();  // Get the token

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      
      // Send the request with the Authorization header
      return this.http.get<TherapeuticalApp>(`${this.apiUrl}/${appId}`, { headers });
    } else {
      // Handle the case when there's no token (e.g., throw an error or return null)
      return this.http.get<TherapeuticalApp>(`${this.apiUrl}/${appId}`);
    }
  }
}
