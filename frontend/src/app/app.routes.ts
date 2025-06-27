import { Routes } from '@angular/router';
import { TasksListComponent } from './pages/tasks-list/tasks-list';

export const routes: Routes = [
  { path: '', component: TasksListComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Redirect from any unknown path to the main page
];
