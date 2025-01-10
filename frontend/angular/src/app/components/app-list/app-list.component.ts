import { Component, OnInit } from '@angular/core';
import { TherapeuticalApp } from '../../models/therapeutical-app.model';
import { TherapeuticAppService } from '../../services/therapeutic-app.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-app-list',
  imports: [RouterModule, CommonModule],
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.css']
})
export class AppListComponent implements OnInit {
  apps: TherapeuticalApp[] = [];

  constructor(private appService: TherapeuticAppService) {}

  ngOnInit(): void {
    this.appService.getApps().subscribe((data) => {
      console.log(data);
      this.apps = data;
    });
  }
}
