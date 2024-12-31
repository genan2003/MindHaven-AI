import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule], // Add FormsModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials = { username: '', password: '' }; // Use this for binding form data
  loginForm: any; // Remove if not used

  constructor(private authService: AuthService, private router: Router) {} // Inject services

  onSubmit() {
    console.log('Attempting to log in with credentials:', this.credentials);
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        const token = response.token; // Assuming the token is returned in response.token
        console.log('Received token:', token);
  
        // Store token and username in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', this.credentials.username);
  
        // Check if profile is completed and navigate accordingly
        const profileCompleted = localStorage.getItem('profileCompleted') === 'true';
        if (profileCompleted) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/complete-profile']);
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Login failed');
      },
    });
  }
  
  
  
  
  
  
}
