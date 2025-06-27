import { CommonModule } from '@angular/common';
import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { TasksService } from '../../services/tasks-service';

@Component({
  selector: 'create-task-dialog',
  templateUrl: './create-task-dialog.html',
  styleUrls: ['./create-task-dialog.scss'],
  imports: [CommonModule, FormsModule, MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatFormFieldModule, MatInputModule],
  standalone: true,
})
export class CreateTaskDialog {
    private readonly dialogRef = inject(MatDialogRef<CreateTaskDialog>);
    private readonly tasksService = inject(TasksService);
    private readonly destroyRef = inject(DestroyRef);

    protected taskName: string = '';
    protected taskDescription: string = '';
    protected saving = false;

    protected onCancel() {
        this.dialogRef.close();
    }

    protected onCreate() {
        if (!this.taskName) {
            return;
        }
        this.saving = true;
        this.tasksService.createTask(this.taskName, this.taskDescription)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                // this.saving = false;
                this.dialogRef.close(true);
            });
    }
}
