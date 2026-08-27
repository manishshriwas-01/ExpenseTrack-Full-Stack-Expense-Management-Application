import { Routes } from '@angular/router';

import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';

import { authGuard } from './guards/auth-guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },

  {
    path: 'add-expense',
    loadComponent: () =>
      import('./components/add-expense/add-expense')
        .then(m => m.AddExpense),
    canActivate: [authGuard]
  },

  {
    path: 'edit-expense/:id',
    loadComponent: () =>
      import('./components/edit-expense/edit-expense')
        .then(m => m.EditExpense),
    canActivate: [authGuard]
  },

  {
    path: 'expenses',
    loadComponent: () =>
      import('./components/expenses/expenses')
        .then(m => m.Expenses),
    canActivate: [authGuard]
  }

];