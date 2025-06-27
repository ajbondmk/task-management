import { CommonModule } from '@angular/common';
import { Component, inject, DestroyRef, OnInit, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CreateTaskDialog } from '../create-task-dialog/create-task-dialog';
import { DeleteTaskDialog } from '../delete-task-dialog/delete-task-dialog';
import { TasksService } from '../../services/tasks-service';
import { Task, TaskStatus } from '../../services/tasks-service';
import { StatusChipComponent } from '../status-chip/status-chip';
import { UpdateTaskDialog } from '../update-task-dialog/update-task-dialog';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule, DatePipe, MatButtonModule, MatDialogModule, MatTableModule, MatIconModule, MatTooltipModule, MatMenuModule, MatProgressBarModule, StatusChipComponent],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss'
})
export class TasksListComponent implements OnInit, OnDestroy {
  private readonly tasksService = inject(TasksService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  displayedColumns: string[] = ['name', 'description', 'status', 'created', 'progressPercentage', 'results', 'actions'];
  dataSource: Task[] = [];
  TaskStatus = TaskStatus;
  private dataRefresher: ReturnType<typeof setTimeout> | undefined =  undefined;

  constructor() {
    this.loadAllTasks();
  }

  ngOnInit() {
    this.dataRefresher = setInterval(() => {
      this.tasksService.listTasks()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(data => {
          this.dataSource.forEach(task => {
            // Update relevant parts of the task without replacing the entire task or entire dataSource.
            // This is to avoid a full refresh of the table, which would close any open dialogs.
            const updatedTask = data.find(t => t.id === task.id);
            if (updatedTask) {
              task.status = updatedTask.status;
              task.progressPercentage = updatedTask.progressPercentage;
              task.results = updatedTask.results;
            }
          });
        });
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.dataRefresher);
  }

  protected openCreateTaskDialog() {
    this.dialog.open(CreateTaskDialog, {
      width: '500px',
    }).afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      if (result) {
        this.loadAllTasks();
      }
    });
  }

  protected openUpdateTaskDialog(task: Task) {
    this.dialog.open(UpdateTaskDialog, {
      width: '500px',
      data: { task }
    }).afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      if (result) {
        this.loadAllTasks();
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
        this.loadAllTasks();
      }
    });
  }

  protected updateTaskStatus(id: number, newStatus: TaskStatus) {
    this.tasksService.updateTaskStatus(id, newStatus)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadAllTasks());
  }

  private loadAllTasks() {
    this.tasksService.listTasks()
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        this.dataSource = data;
      });
  }
}
