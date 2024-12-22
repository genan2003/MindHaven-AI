import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        role: ['USER', Validators.required],
        institutionId: [null] // Defaults to null for non-researchers
      });
      
      // Add conditional validation for institutionId based on role
      this.registerForm.get('role')?.valueChanges.subscribe((role) => {
        const institutionIdControl = this.registerForm.get('institutionId');
        if (role === 'RESEARCHER') {
          institutionIdControl?.setValidators([Validators.required]);
        } else {
          institutionIdControl?.clearValidators();
        }
        institutionIdControl?.updateValueAndValidity();
      });
      
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          alert('Registration successful!');
          this.router.navigate(['/login']);
        },
        error: () => {
          alert('Registration failed. Please try again.');
        }
      });
    } else {
      alert('Please fill out all required fields.');
    }
  }
}
