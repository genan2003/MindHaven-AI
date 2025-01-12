import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TherapeuticalApp } from '../models/therapeutical-app.model';
import {jwtDecode} from 'jwt-decode';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';


export interface DecodedToken {
  sub: string; // username
  role: string; // user role
  exp: number; // expiration time
  imports: [RouterModule];
}

@Injectable({
  providedIn: 'root',
})


export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  getUserRole(): string | null {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      return decoded.role; // Return the user's role
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(credentials: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(`${this.baseUrl}/login`, credentials, {
      headers,
      withCredentials: true, // Include cookies if backend requires them
    });
  }

  getProtectedData() {
    return this.http.get(`${this.baseUrl}/protected-data`, { withCredentials: true });
  }

  decodeToken(token: string): any {
    const payload = atob(token.split('.')[1]);
    return JSON.parse(payload);
  }

  completeProfile(data: any, username: string): Observable<any> {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    console.log('Token retrieved:', token);  // Log to verify token
  
    if (!token) {
      console.error('No token found');
      // Handle missing token error
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Attach the token to the request
    });
    
    return this.http.put<any>(
      `http://localhost:8080/api/auth/users/${username}/complete-profile`,
      data,
      { 
        headers, 
        responseType: 'text' as 'json'  // Specify the response type as text
      }
    );
  }

  addApp(app: any): Observable<any> {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  
    return this.http.post('http://localhost:8080/api/apps', app, { headers });
  }
  
  
  getApps(): Observable<TherapeuticalApp[]> {
    const url = 'http://localhost:8080/api/apps'; // Ensure the base URL is correct
    console.log('Fetching apps from:', url); // Debug log
    return this.http.get<TherapeuticalApp[]>(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
  }

  logout(): void {
    // Remove the JWT token from storage
    localStorage.removeItem('authToken'); 
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('profileCompleted');
    
    // Optionally make a request to the backend to log out (if desired)
    // this.http.post('/api/auth/logout', {}).subscribe();

    // Redirect the user to the login page
    this.router.navigate(['/home']);
  }
  
  
  
  
}
