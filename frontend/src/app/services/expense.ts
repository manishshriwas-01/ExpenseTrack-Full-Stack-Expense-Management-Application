import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Expense {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/expenses';

  getExpenses() {
    return this.http.get<any>(this.apiUrl);
  }
  createExpense(expense: any) {
    return this.http.post<any>(this.apiUrl, expense);
  }
  updateExpense(id: string, expense: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, expense);
  }
  getExpenseById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  deleteExpense(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

}
