import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  imports: [ReactiveFormsModule, FormsModule, CommonModule]
})
export class ChatbotComponent {
  messages: { text: string; type: 'user' | 'bot' }[] = [];
  userMessage: string = '';

  constructor(private http: HttpClient) {}

  sendMessage() {
    if (!this.userMessage.trim()) return;

    // Add user's message to chat
    this.messages.push({ text: this.userMessage, type: 'user' });

    const apiUrl = 'http://127.0.0.1:8000/chat'; // Replace with your backend endpoint
    const payload = {
      question: this.userMessage,
      context: 'This is a mental health chatbot. Please provide mental health-related answers.',
    };

    // Clear input field
    this.userMessage = '';

    // Call backend API
    this.http.post<{ answer: string }>(apiUrl, payload).subscribe({
      next: (response) => {
        this.messages.push({ text: response.answer, type: 'bot' });
      },
      error: (err) => {
        console.error('Error:', err);
        this.messages.push({ text: 'I encountered an error. Please try again.', type: 'bot' });
      },
    });
  }
}
