import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateTaskDialog } from '../create-task-dialog/create-task-dialog';
import { DeleteTaskDialog } from '../delete-task-dialog/delete-task-dialog';
import { TasksService } from '../../services/tasks-service';
import { Task } from '../../services/tasks-service';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatTableModule, MatIconModule, MatTooltipModule],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss'
})
export class TasksListComponent {
  private readonly tasksService = inject(TasksService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  displayedColumns: string[] = ['name', 'created', 'actions'];
  dataSource: Task[] = [];

  constructor() {
    this.loadTasks();
  }

  protected createTask() {
    this.tasksService.createTask("button made this")
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadTasks());
  }

  protected openCreateTaskDialog() {
    this.dialog.open(CreateTaskDialog, {
      width: '500px',
    }).afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  protected openDeleteTaskDialog(task: Task) {
    this.dialog.open(DeleteTaskDialog, {
      width: '500px',
      data: { task }
    }).afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  private loadTasks() {
    this.tasksService.listTasks()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.dataSource = data);
  }
}
