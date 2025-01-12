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
  apps: TherapeuticalApp[] = [];
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
      if(this.isLoggedIn) this.appService.getApps().subscribe((data) => {
        this.apps = data;
        this.generateFilters();
    });
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
  }

  logout() {
    this.authService.logout();
  }
}
