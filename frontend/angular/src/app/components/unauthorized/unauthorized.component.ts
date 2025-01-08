import { Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  template: `<h2>Access Denied</h2><p>You do not have permission to view this page.</p>`,
  styles: ['h2 { color: red; }'],
})
export class UnauthorizedComponent {}
