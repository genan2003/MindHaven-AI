import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatbotSidebarComponent } from '../chatbot-sidebar/chatbot-sidebar.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [ReactiveFormsModule, FormsModule, CommonModule, ChatbotSidebarComponent],
})
export class ChatComponent {
  userMessage = '';
  conversation: { sender: string; message: string }[] = [];
  messages: { text: string; type: 'user' | 'bot' }[] = [];

  constructor(private chatService: ChatService) {}

  sendMessage() {
    if (this.userMessage.trim() === '') {
      return; // Prevent sending empty messages
    }

    // Add the user's message to the conversation and messages array
    this.conversation.push({ sender: 'User', message: this.userMessage });
    this.messages.push({ text: this.userMessage, type: 'user' });

    // Call the Chat API
    this.chatService.sendMessage(this.userMessage).subscribe({
      next: (response) => {
        // Add the bot's response to the conversation and messages array
        this.conversation.push({ sender: 'Bot', message: response.bot_response });
        this.messages.push({ text: response.bot_response, type: 'bot' });
        this.userMessage = ''; // Clear the input field
      },
      error: (err) => {
        console.error('Error sending message:', err);
        const errorMessage = 'Sorry, there was an error.';
        this.conversation.push({ sender: 'Bot', message: errorMessage });
        this.messages.push({ text: errorMessage, type: 'bot' });
      },
    });
  }
}
