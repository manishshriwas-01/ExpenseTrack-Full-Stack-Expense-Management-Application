import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Expense } from '../../services/expense';

@Component({
  selector: 'app-edit-expense',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-expense.html',
  styleUrl: './edit-expense.css'
})
export class EditExpense implements OnInit {

  private fb = inject(FormBuilder);
  private expenseService = inject(Expense);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal('');
  expenseId = '';

  expenseForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    category: ['', Validators.required],
    description: [''],
    date: ['', Validators.required]
  });

  ngOnInit() {
    this.expenseId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.expenseId) {
      this.errorMessage.set('Expense ID not found');
      return;
    }

    this.loadExpense();
  }

  loadExpense() {
    this.isLoading.set(true);

    this.expenseService.getExpenseById(this.expenseId).subscribe({
      next: (response) => {
        const expense = response.expense;

        this.expenseForm.patchValue({
          title: expense.title,
          amount: expense.amount,
          category: expense.category,
          description: expense.description,
          date: expense.date?.substring(0, 10) || ''
        });

        this.isLoading.set(false);
      },

      error: (error) => {
        console.error('Failed to fetch expense:', error);
        this.errorMessage.set(error.error?.message || 'Failed to load expense');
        this.isLoading.set(false);
      }
    });
  }

  updateExpense() {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.expenseService.updateExpense(this.expenseId, this.expenseForm.getRawValue()).subscribe({
      next: (response) => {
        console.log('Expense updated:', response);
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },

      error: (error) => {
        console.error('Failed to update expense:', error);
        this.errorMessage.set(error.error?.message || 'Failed to update expense');
        this.isLoading.set(false);
      }
    });
  }
}