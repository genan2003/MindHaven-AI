import { Component, OnInit } from '@angular/core';
import { TherapeuticalApp } from '../../models/therapeutical-app.model';
import { TherapeuticAppService } from '../../services/therapeutic-app.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-app-list',
  imports: [RouterModule, CommonModule],
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.css']
})
export class AppListComponent implements OnInit {
  apps: TherapeuticalApp[] = [];
  isLoggedIn: boolean = false;

  constructor(private appService: TherapeuticAppService, private authService: AuthService) {}

  ngOnInit(): void {
      const user = localStorage.getItem('authToken');
      this.isLoggedIn = user ? true : false;
      if(this.isLoggedIn) this.appService.getApps().subscribe((data) => {
        this.apps = data;
    });
  }

  logout() {
    this.authService.logout();
  }
}
