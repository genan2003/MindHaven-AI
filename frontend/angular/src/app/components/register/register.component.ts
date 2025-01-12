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
  standalone: true,
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword: boolean = false; // Controls password visibility
  selectedRole: string = 'USER'; // Default selected role

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
      confirmPassword: ['', Validators.required],
      role: [this.selectedRole], // Default role is Patient
      institution: [''], // Institution field, initially empty
    });

    this.updateInstitutionFieldValidation(); // Ensure initial validation is applied
  }

  // Toggle visibility of the password field
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Handle role selection and update form accordingly
  selectRole(role: string): void {
    this.selectedRole = role; // Update the selected role
    this.registerForm.patchValue({ role }); // Update the role in the form
    this.updateInstitutionFieldValidation();
  }

  // Dynamically validate Institution field based on role
  updateInstitutionFieldValidation(): void {
    const institutionControl = this.registerForm.get('institution');
    if (this.selectedRole === 'RESEARCHER') {
      institutionControl?.setValidators([Validators.required]); // Add required validator
    } else {
      institutionControl?.clearValidators(); // Remove validators
    }
    institutionControl?.updateValueAndValidity(); // Update validation state
  }

  // Handle form submission
  onSubmit(): void {
    if (this.registerForm.valid) {
      if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      // Submit registration data
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          alert('Registration successful!');
          this.router.navigate(['/login']);
        },
        error: () => {
          alert('Registration failed. Please try again.');
        },
      });
    } else {
      alert('Please fill out all required fields.');
    }
  }
}
