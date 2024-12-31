import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

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
    });  }

  // Method to get protected data (no JWT handling)
  getProtectedData() {
    return this.http.get(`${this.baseUrl}/protected-data`, { withCredentials: true });
  }

  decodeToken(token: string): any {
    const payload = atob(token.split('.')[1]);
    return JSON.parse(payload);
}

completeProfile(data: any, username: string): Observable<any> {
  const token = localStorage.getItem('authToken'); // Retrieve token from local storage
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`, // Send token in Authorization header
  });

  return this.http.put<any>(
    `http://localhost:8080/api/auth/users/${username}/complete-profile`,
    data,
    { headers }
  );
}



}
