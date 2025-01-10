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
    return localStorage.getItem('authToken');  // Ensure the correct key for token
  }
  
  getApps(): Observable<TherapeuticalApp[]> {
    const token = this.getAuthToken();  // Get the token
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  
    return this.http.get<TherapeuticalApp[]>(this.apiUrl, { headers });
  }
  
  getAppById(appId: number): Observable<TherapeuticalApp> {
    const token = this.getAuthToken();  // Get the token
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  
    return this.http.get<TherapeuticalApp>(`${this.apiUrl}/${appId}`, { headers });
  }
}
