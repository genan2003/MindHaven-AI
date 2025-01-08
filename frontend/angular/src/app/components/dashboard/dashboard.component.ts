import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TherapeuticalApp } from '../../models/therapeutical-app.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports : [ReactiveFormsModule, FormsModule, CommonModule]
})
export class DashboardComponent implements OnInit {
  app: TherapeuticalApp = {
    name: '',
    description: '',
    ageGroup: '',
    mentalHealthDisorder: '',
  };

  apps: TherapeuticalApp[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadApps();
  }

  addApp() {
    this.authService.addApp(this.app).subscribe({
      next: (response) => {
        console.log('App added successfully:', response);
        this.loadApps(); // Refresh the list
        this.app = { name: '', description: '', ageGroup: '', mentalHealthDisorder: '' }; // Reset the form
      },
      error: (error) => {
        console.error('Error adding app:', error);
        alert('Failed to add app.');
      },
    });
  }

  loadApps() {
    console.log('Attempting to load apps...');
    this.authService.getApps().subscribe({
      next: (response) => {
        console.log('Apps successfully loaded:', response); // Debug log
        this.apps = response; // Assign the response to the `apps` array
      },
      error: (error) => {
        console.error('Error loading apps:', error);
        alert('Failed to load apps.');
      },
    });
  }
  
}
