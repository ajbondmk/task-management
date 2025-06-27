import { CommonModule } from '@angular/common';
import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogActions,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { Task, TasksService } from '../../services/tasks-service';

@Component({
  selector: 'delete-task-dialog',
  templateUrl: './delete-task-dialog.html',
  styleUrls: ['./delete-task-dialog.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
  ],
  standalone: true,
})
export class DeleteTaskDialog {
  private readonly dialogRef = inject(MatDialogRef<DeleteTaskDialog>);
  private readonly tasksService = inject(TasksService);
  private readonly destroyRef = inject(DestroyRef);

  protected data: { task: Task } = inject(MAT_DIALOG_DATA);
  protected saving = false;

  protected onCancel() {
    this.dialogRef.close();
  }

  protected onDelete() {
    this.saving = true;
    this.tasksService
      .deleteTask(this.data.task.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }
}
