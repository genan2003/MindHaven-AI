import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://127.0.0.1:8000/chat'; // Update with your FastAPI URL if different

  constructor(private http: HttpClient) {}

  sendMessage(userMessage: string): Observable<{ bot_response: string }> {
    return this.http.post<{ bot_response: string }>(this.apiUrl, { user_message: userMessage });
  }
}
