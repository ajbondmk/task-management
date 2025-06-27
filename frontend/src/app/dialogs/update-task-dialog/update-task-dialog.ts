import { CommonModule } from '@angular/common';
import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatDialogRef,
  MatDialogActions,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Task, TasksService } from '../../services/tasks-service';

@Component({
  selector: 'update-task-dialog',
  templateUrl: './update-task-dialog.html',
  styleUrls: ['./update-task-dialog.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
    MatFormFieldModule,
    MatInputModule,
  ],
  standalone: true,
})
export class UpdateTaskDialog {
  private readonly dialogRef = inject(MatDialogRef<UpdateTaskDialog>);
  private readonly tasksService = inject(TasksService);
  private readonly destroyRef = inject(DestroyRef);

  protected data: { task: Task } = inject(MAT_DIALOG_DATA);
  protected updatedName: string = this.data.task.name;
  protected updatedDescription: string = this.data.task.description;
  protected saving = false;

  protected onCancel() {
    this.dialogRef.close();
  }

  protected onUpdate() {
    if (!this.updatedName) {
      return;
    }
    if (
      this.data.task.name === this.updatedName &&
      this.data.task.description === this.updatedDescription
    ) {
      this.dialogRef.close();
      return;
    }
    this.saving = true;
    this.tasksService
      .updateTask(this.data.task.id, this.updatedName, this.updatedDescription)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }
}
