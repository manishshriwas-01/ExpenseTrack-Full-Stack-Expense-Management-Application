import {
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { Expense } from '../../services/expense';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-expenses',
  imports: [DatePipe],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css'
})
export class Expenses implements OnInit {

  private expenseService = inject(Expense);

  expenses = signal<any[]>([]);

  searchTerm = signal('');
  selectedCategory = signal('All');
  selectedSort = signal('newest');

  isLoading = signal(false);
  errorMessage = signal('');


  filteredExpenses = computed(() => {

    let result = [...this.expenses()];

    const search = this.searchTerm()
      .toLowerCase()
      .trim();

    const category = this.selectedCategory();
    const sort = this.selectedSort();


    // Search
    if (search) {

      result = result.filter(expense =>
        expense.title
          .toLowerCase()
          .includes(search)
      );

    }


    // Category filter
    if (category !== 'All') {

      result = result.filter(expense =>
        expense.category === category
      );

    }


    // Sorting
    if (sort === 'newest') {

      result.sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
      );

    }

    if (sort === 'oldest') {

      result.sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      );

    }

    if (sort === 'highest') {

      result.sort(
        (a, b) =>
          Number(b.amount) -
          Number(a.amount)
      );

    }

    if (sort === 'lowest') {

      result.sort(
        (a, b) =>
          Number(a.amount) -
          Number(b.amount)
      );

    }

    return result;

  });


  ngOnInit() {
    this.loadExpenses();
  }


  loadExpenses() {

    this.isLoading.set(true);

    this.expenseService.getExpenses().subscribe({

      next: (response) => {

        this.expenses.set(response.expenses);

        this.isLoading.set(false);

      },

      error: (error) => {

        console.error(
          'Failed to fetch expenses:',
          error
        );

        this.errorMessage.set(
          error.error?.message ||
          'Failed to load expenses'
        );

        this.isLoading.set(false);

      }

    });

  }


  updateSearch(event: Event) {

    const input =
      event.target as HTMLInputElement;

    this.searchTerm.set(input.value);

  }


  updateCategory(event: Event) {

    const select =
      event.target as HTMLSelectElement;

    this.selectedCategory.set(select.value);

  }


  updateSort(event: Event) {

    const select =
      event.target as HTMLSelectElement;

    this.selectedSort.set(select.value);

  }

}