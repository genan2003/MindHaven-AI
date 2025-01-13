import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [ReactiveFormsModule, FormsModule, CommonModule]
})
export class ChatComponent {
  userMessage = '';
  conversation: { sender: string; message: string }[] = [];

  constructor(private chatService: ChatService) {}

  sendMessage() {
    if (this.userMessage.trim() === '') {
      return;
    }

    // Add the user's message to the conversation
    this.conversation.push({ sender: 'User', message: this.userMessage });

    // Call the Chat API
    this.chatService.sendMessage(this.userMessage).subscribe({
      next: (response) => {
        // Add the bot's response to the conversation
        this.conversation.push({ sender: 'Bot', message: response.bot_response });
        this.userMessage = ''; // Clear input field
      },
      error: (err) => {
        console.error('Error sending message:', err);
        this.conversation.push({ sender: 'Bot', message: 'Sorry, there was an error.' });
      }
    });
  }
}
