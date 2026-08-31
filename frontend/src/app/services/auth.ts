import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<any | null>(null);

  private apiUrl = 'https://expensetrack-full-stack-expense.onrender.com/api/auth';

  getCurrentUser() {
    return this.http.get<any>(
      `${this.apiUrl}/me`
    );
  }

  setUser(user: any) {
    this.currentUser.set(user);
  }


  register(data: any) {
    return this.http.post(
      `${this.apiUrl}/register`,
      data
    );
  }

  login(data: any) {
    return this.http.post(
      `${this.apiUrl}/login`,
      data
    );
  }

  logout() {
    localStorage.removeItem('token');

    this.router.navigate(['/login']);
  }
}