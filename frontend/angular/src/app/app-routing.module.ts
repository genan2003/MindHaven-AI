import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { AppListComponent } from './components/app-list/app-list.component';
import { AppDetailComponent } from './components/app-detail/app-detail.component';
import { ResearcherGuard } from './guards/researcher.guard';
import { LoggedInGuard } from './guards/logged-in.guard';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [
  // Default route: Redirect based on login status
  {
    path: '',
    canActivate: [LoggedInGuard], // Guard determines if the user should be redirected to /apps
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },

  // Public routes
  { path: 'home', component: HomeComponent, canActivate: [LoggedInGuard] },
  { path: 'about', component: AboutComponent, canActivate: [LoggedInGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [LoggedInGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoggedInGuard] },

  { path: 'edit-profile', component: ProfileEditComponent },// Private routes
  { path: 'complete-profile', component: CompleteProfileComponent, canActivate: [LoggedInGuard] },
  { path: 'apps', component: AppListComponent, canActivate: [LoggedInGuard] },
  { path: 'apps/:id', component: AppDetailComponent, canActivate: [LoggedInGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [ResearcherGuard] },
  { path: 'chatbot', component: ChatComponent, canActivate: [LoggedInGuard] },

  // Unauthorized and fallback routes
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
