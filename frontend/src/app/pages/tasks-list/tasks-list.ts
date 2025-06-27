import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  DestroyRef,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CreateTaskDialog } from '../../dialogs/create-task-dialog/create-task-dialog';
import { DeleteTaskDialog } from '../../dialogs/delete-task-dialog/delete-task-dialog';
import { TasksService } from '../../services/tasks-service';
import { Task, TaskStatus } from '../../services/tasks-service';
import { StatusChipComponent } from '../../components/status-chip/status-chip';
import { UpdateTaskDialog } from '../../dialogs/update-task-dialog/update-task-dialog';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSortModule,
    StatusChipComponent,
  ],
  templateUrl: './tasks-list.html',
  styleUrl: './tasks-list.scss',
})
export class TasksListComponent implements OnInit, OnDestroy {
  private readonly tasksService = inject(TasksService);
  private readonly dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  displayedColumns: string[] = [
    'name',
    'description',
    'status',
    'created',
    'progressPercentage',
    'results',
    'actions',
  ];
  dataSource: Task[] = [];
  TaskStatus = TaskStatus;
  private dataRefresher: ReturnType<typeof setTimeout> | undefined = undefined;

  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.loadAllTasks();
  }

  ngOnInit() {
    // Update data on task progress (status, progressPercentage & results) on a regular basis (every second).
    // Only replace the relevant parts of the task, without replacing the entire task or entire dataSource.
    // This is to avoid a full refresh of the table, which would close any open dialogs.
    this.dataRefresher = setInterval(() => {
      this.tasksService
        .listTasks()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((data) => {
          this.dataSource.forEach((task) => {
            const updatedTask = data.find((t) => t.id === task.id);
            if (updatedTask) {
              if (
                task.status !== updatedTask.status &&
                updatedTask.status === TaskStatus.Completed
              ) {
                this.snackBar.open(
                  `Task '${task.name}' is complete!`,
                  'Dismiss',
                  {
                    duration: 3000,
                  }
                );
                task.status = updatedTask.status;
              }
              if (task.progressPercentage !== updatedTask.progressPercentage) {
                task.progressPercentage = updatedTask.progressPercentage;
              }
              if (task.results !== updatedTask.results) {
                task.results = updatedTask.results;
              }
            }
          });
        });
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.dataRefresher);
  }

  protected openCreateTaskDialog() {
    this.dialog
      .open(CreateTaskDialog, {
        width: '500px',
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) {
          this.loadAllTasks();
        }
      });
  }

  protected openUpdateTaskDialog(task: Task) {
    this.dialog
      .open(UpdateTaskDialog, {
        width: '500px',
        data: { task },
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) {
          this.loadAllTasks();
        }
      });
  }

  protected openDeleteTaskDialog(task: Task) {
    this.dialog
      .open(DeleteTaskDialog, {
        width: '500px',
        data: { task },
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) {
          this.loadAllTasks();
        }
      });
  }

  protected updateTaskStatus(id: number, newStatus: TaskStatus) {
    this.tasksService
      .updateTaskStatus(id, newStatus)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadAllTasks());
  }

  protected onSort(event: Sort) {
    if (!event.active || event.direction === '') {
      return;
    }
    this.dataSource = this.dataSource.slice().sort((a, b) => {
      const isAsc = event.direction === 'asc';
      switch (event.active) {
        case 'name':
          return a.name.localeCompare(b.name) * (isAsc ? 1 : -1);
        case 'status':
          return (b.status - a.status) * (isAsc ? 1 : -1);
        case 'created':
          return (a.created < b.created ? 1 : -1) * (isAsc ? 1 : -1);
        default:
          return 0;
      }
    });
  }

  // A full refresh of the list of tasks.
  private loadAllTasks() {
    this.tasksService
      .listTasks()
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.dataSource = data;
      });
  }
}
