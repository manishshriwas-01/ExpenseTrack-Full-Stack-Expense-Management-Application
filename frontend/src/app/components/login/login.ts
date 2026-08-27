import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';



@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  
  private fb=inject(FormBuilder);
  private auth=inject(Auth);
  private router=inject(Router);
  
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  errorMessage = '';

  onSubmit(){
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }
    this.auth.login(this.loginForm.getRawValue()).subscribe({
      next:(response:any)=>{
        localStorage.setItem('token',response.token);
        this.router.navigate(['/dashboard']);
      },
      error:(error)=>{
        this.errorMessage=error.error?.message || 'Invalid email or password';
      }
    });
  }

}
