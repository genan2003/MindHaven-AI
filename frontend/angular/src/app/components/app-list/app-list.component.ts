import { Component, OnInit } from '@angular/core';
import { TherapeuticalApp } from '../../models/therapeutical-app.model';
import { TherapeuticAppService } from '../../services/therapeutic-app.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-app-list',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.css']
})
export class AppListComponent implements OnInit {
  apps: TherapeuticalApp[] = []; // All fetched apps
  filteredApps: TherapeuticalApp[] = []; // Apps after applying filters
  searchQuery: string = ''; // Store the search query for app name
  selectedAgeGroup: string = ''; // Store selected age group for filtering
  selectedDisorder: string = ''; // Store selected disorder for filtering
  ageGroups: string[] = []; // List of available age groups
  disorders: string[] = []; // List of available mental health disorders
  isLoggedIn: boolean = false;

  constructor(private appService: TherapeuticAppService, private authService: AuthService) {}

  ngOnInit(): void {
    const user = localStorage.getItem('authToken');
    this.isLoggedIn = user ? true : false;
    if (this.isLoggedIn) {
      this.appService.getApps().subscribe((data) => {
        this.apps = data;
        this.filteredApps = [...this.apps]; // Initially show all apps
        this.generateFilters(); // Generate filter options based on all apps
      });
    }
  }

  generateFilters() {
    const uniqueAgeGroups = new Set<string>();
    const uniqueDisorders = new Set<string>();

    // Extract unique age groups and disorders from the fetched apps
    this.apps.forEach((app) => {
      if (app.ageGroup) uniqueAgeGroups.add(app.ageGroup);
      if (app.mentalHealthDisorder) uniqueDisorders.add(app.mentalHealthDisorder);
    });

    this.ageGroups = Array.from(uniqueAgeGroups);
    this.disorders = Array.from(uniqueDisorders);
  }

  // Apply filters based on search query, selected age group, and selected disorder
  filterApps() {
    // Check if there are any filters applied
    if (this.searchQuery || this.selectedAgeGroup || this.selectedDisorder) {
      this.filteredApps = this.apps.filter((app) => {
        const matchesName = this.searchQuery
          ? app.name!.toLowerCase().includes(this.searchQuery.toLowerCase())
          : true;
        const matchesAgeGroup = this.selectedAgeGroup
          ? app.ageGroup === this.selectedAgeGroup
          : true;
        const matchesDisorder = this.selectedDisorder
          ? app.mentalHealthDisorder === this.selectedDisorder
          : true;

        return matchesName && matchesAgeGroup && matchesDisorder;
      });
    } else {
      // If no filters, show all apps
      this.filteredApps = [...this.apps];
    }
  }

  // Reset all filters to show all apps
  resetFilters() {
    this.searchQuery = '';
    this.selectedAgeGroup = '';
    this.selectedDisorder = '';
    this.filteredApps = [...this.apps]; // Reset the app list to show all apps
  }

  logout() {
    this.authService.logout();
  }
}
