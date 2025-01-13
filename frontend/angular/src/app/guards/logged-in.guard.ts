import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoggedInGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isLoggedIn = !!localStorage.getItem('authToken'); // Check if user is logged in
    const isPublicRoute = ['home', 'about', 'login', 'register'].includes(route.routeConfig?.path || '');

    if (isLoggedIn && isPublicRoute) {
      // Redirect logged-in users trying to access public routes to `/apps`
      this.router.navigate(['/apps']);
      return false;
    }

    if (!isLoggedIn && !isPublicRoute) {
      // Redirect non-logged-in users trying to access private routes to `/home`
      this.router.navigate(['/home']);
      return false;
    }

    // Allow access to the intended route
    return true;
  }
}
