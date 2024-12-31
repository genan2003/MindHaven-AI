import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.css'],
  imports: [ReactiveFormsModule, FormsModule],
})
export class CompleteProfileComponent {
  profileData = {
    firstName: '',
    lastName: '',
    age: null,
    mentalHealthDisorder: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    const username = localStorage.getItem('username'); // Retrieve username
    if (!username) {
      alert('User not logged in.');
      return;
    }
  
    console.log('Submitting profile data:', this.profileData);
  
    this.authService.completeProfile(this.profileData, username).subscribe({
      next: (response) => {
        console.log('Profile updated successfully:', response);
  
        // Mark profile as completed in localStorage
        localStorage.setItem('profileCompleted', 'true');
  
        // Redirect to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        alert('Failed to complete profile. Please try again.');
      },
    });
  }
  
  
}
