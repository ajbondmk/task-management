import { Component, inject, DestroyRef } from '@angular/core';
import { TasksService } from '../services/tasks-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss'
})
export class TasksListComponent {
  private tasksService = inject(TasksService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.loadTasks();
  }

  protected createTask() {
    this.tasksService.createTask("button made this")
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadTasks());
  }

  private loadTasks() {
    this.tasksService.listTasks()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => console.log(data));
  }
}
