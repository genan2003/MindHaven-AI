import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { AppListComponent } from './components/app-list/app-list.component';
import { AppDetailComponent } from './components/app-detail/app-detail.component';
import { ReviewListComponent } from './components/review-list/review-list.component';
import { ReviewFormComponent } from './components/review-form/review-form.component';
import { ResearcherGuard } from './guards/researcher.guard';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent }, // About page
  { path: 'register', component: RegisterComponent }, // Registration route
  { path: 'login', component: LoginComponent }, // Login route
  { path: 'complete-profile', component: CompleteProfileComponent }, // Profile completion route
  { path: 'dashboard', component: DashboardComponent, canActivate: [ResearcherGuard] }, // Dashboard route with guard
  { path: 'unauthorized', component: UnauthorizedComponent }, // Unauthorized access route
  { path: 'apps', component: AppListComponent }, // Route to list all apps
  { path: 'apps/:id', component: AppDetailComponent }, // Route for app details
  { path: 'apps/:id/reviews', component: ReviewListComponent }, // Route for listing reviews for an app
  { path: 'apps/:id/reviews/new', component: ReviewFormComponent }, // Route for adding a new review
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirect any undefined routes to Home
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
