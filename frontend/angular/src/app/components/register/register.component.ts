import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  user: any = { role: 'user' };

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.register(this.user).subscribe(
      (response) => {
        alert('Registration successful!');
      },
      (error) => {
        alert('Registration failed: ' + error.error.message);
      }
    );
  }
}
