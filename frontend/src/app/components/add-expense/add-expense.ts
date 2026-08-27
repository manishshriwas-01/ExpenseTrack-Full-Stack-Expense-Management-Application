import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { Expense } from '../../services/expense';

@Component({
  selector: 'app-add-expense',
  imports: [ReactiveFormsModule],
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.css'
})
export class AddExpense {

  private fb = inject(FormBuilder);
  private expenseService = inject(Expense);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal('');

  expenseForm = this.fb.nonNullable.group({

    title: ['', Validators.required],

    amount: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    category: ['', Validators.required],

    description: [''],

    date: ['', Validators.required]

  });

  submitExpense() {

    if (this.expenseForm.invalid) {

      this.expenseForm.markAllAsTouched();

      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const expenseData = this.expenseForm.getRawValue();

    this.expenseService
      .createExpense(expenseData)
      .subscribe({

        next: (response) => {

          console.log(
            'Expense created:',
            response
          );

          this.isLoading.set(false);

          this.router.navigate(['/dashboard']);

        },

        error: (error) => {

          console.error(
            'Failed to create expense:',
            error
          );

          this.isLoading.set(false);

          this.errorMessage.set(
            error.error?.message ||
            'Failed to create expense'
          );

        }

      });

  }

}