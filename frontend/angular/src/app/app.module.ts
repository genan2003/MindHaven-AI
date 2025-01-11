import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { AppListComponent } from './components/app-list/app-list.component'; // Added
import { AppDetailComponent } from './components/app-detail/app-detail.component';
import { ReviewListComponent } from './components/review-list/review-list.component';
import { ReviewFormComponent } from './components/review-form/review-form.component';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    HomeComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
