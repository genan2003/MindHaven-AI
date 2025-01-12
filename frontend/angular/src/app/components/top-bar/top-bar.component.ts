import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-top-bar',
  standalone: true, // Marking it as standalone
  imports: [CommonModule], // Importing CommonModule for directives like *ngIf
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent implements OnInit {
  isLoggedIn: boolean = false; // Tracks the login state

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Check if the user is logged in by checking for the presence of the auth token
    const user = localStorage.getItem('authToken');
    this.isLoggedIn = !!user; // Converts to boolean
  }

  logout(): void {
    // Logout logic
    this.authService.logout(); // Clear the user's session
    this.isLoggedIn = false; // Update the login state
    this.router.navigate(['/login']); // Redirect to the login page
  }
}
