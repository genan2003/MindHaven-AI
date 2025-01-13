import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  imports: [FormsModule, CommonModule],
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  age: number | null = null;
  mentalHealthDisorder: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  username: string = ''; // Add a username field

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.username = this.authService.getUsernameFromToken(); // Get username from token or localStorage
    this.loadUserProfile(); // Load user data when the component initializes
  }

  loadUserProfile(): void {
    this.authService.getUserProfile(this.username).subscribe(
      (response) => {
        // Assuming response contains the current user data
        this.firstName = response.firstName || '';
        this.lastName = response.lastName || '';
        this.age = response.age || null;
        this.mentalHealthDisorder = response.mentalHealthDisorder || '';
      },
      (error) => {
        this.errorMessage = 'Failed to load user profile';
        console.error('Error loading profile:', error);
      }
    );
  }

  onSubmit(): void {
    const profileData = {
      firstName: this.firstName,
      lastName: this.lastName,
      age: this.age,
      mentalHealthDisorder: this.mentalHealthDisorder,
    };

    this.authService.updateProfile(profileData).subscribe(
      (response) => {
        this.successMessage = 'Profile updated successfully';
        this.router.navigate(['/profile']); // Redirect to profile page or another page
      },
      (error) => {
        this.errorMessage = error.error || 'Error updating profile';
      }
    );
  }
}
