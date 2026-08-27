import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { Expense } from '../../services/expense';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private expenseService = inject(Expense);
  private router = inject(Router);
  private authService = inject(Auth);
  isLoading = signal(false);

  expenses = signal<any[]>([]);

  currentUser = this.authService.currentUser;

  goToAddExpense() {
    this.router.navigate(['/add-expense']);
  }
  editExpense(id: string) {
    this.router.navigate(['/edit-expense', id]);
  }
  logout() {
    this.authService.logout();
  }
  goToExpenses() {
    this.router.navigate(['/expenses']);
  }
  totalExpenses = computed(() => {
    return this.expenses().reduce(
      (total, expense) => total + expense.amount,
      0
    );
  });

  totalTransactions = computed(() => {
    return this.expenses().length;
  });

  monthlyExpenses = computed(() => {

    const currentDate = new Date();

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return this.expenses()
      .filter(expense => {

        const expenseDate = new Date(expense.date);

        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );

      })
      .reduce(
        (total, expense) => total + expense.amount,
        0
      );
  });

  ngOnInit() {
    this.loadExpenses();
    this.loadCurrentUser();
  }


  loadCurrentUser() {

    this.authService.getCurrentUser().subscribe({

      next: (response) => {

        console.log('Current User:', response.user);

        this.authService.setUser(response.user);

      },

      error: (error) => {

        console.error(
          'Failed to fetch current user:',
          error
        );

      }

    });

  }

  loadExpenses() {

    this.isLoading.set(true);
    this.expenseService.getExpenses().subscribe({

      next: (response) => {

        // console.log('Expenses Response:', response);

        this.expenses.set(response.expenses);
         setTimeout(() => {
        this.isLoading.set(false);
      }, 1000);


      },

      error: (error) => {

        console.error('Failed to fetch expenses:', error);
         setTimeout(() => {
        this.isLoading.set(false);
      }, 1000);
      }

    });

  }

  deleteExpense(id: string) {
    const confirmed = confirm(
      'Are you sure you want to delete this expense?'
    );

    if (!confirmed) {
      return;
    }

    this.expenseService.deleteExpense(id).subscribe({
      next: (response) => {
        console.log('Expense deleted:', response);
        this.loadExpenses();
      },

      error: (error) => {
        console.error('Failed to delete expense:', error);
      }
    });
  }

}