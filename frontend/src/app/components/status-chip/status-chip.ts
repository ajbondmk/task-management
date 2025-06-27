import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TaskStatus } from '../../services/tasks-service';
import { Pipe, PipeTransform } from '@angular/core';

/** A pipe to transform a task's status to a human readable display string. */
@Pipe({ name: 'statusDisplayName', standalone: true })
export class StatusDisplayNamePipe implements PipeTransform {
  transform(value: TaskStatus): string {
    switch (value) {
      case TaskStatus.NotStarted:
        return 'Not Started';
      case TaskStatus.InProgress:
        return 'In Progress';
      case TaskStatus.Completed:
        return 'Completed';
      case TaskStatus.Paused:
        return 'Paused';
      case TaskStatus.Cancelled:
        return 'Cancelled';
      default:
        return 'Unknown Status';
    }
  }
}

/** A pipe to transform a task's status to a colour for display purposes. */
@Pipe({ name: 'statusColour', standalone: true })
export class StatusColourPipe implements PipeTransform {
  transform(value: TaskStatus): string {
    switch (value) {
      case TaskStatus.InProgress:
        return 'blue';
      case TaskStatus.Completed:
        return 'green';
      case TaskStatus.Paused:
        return 'orange';
      case TaskStatus.Cancelled:
        return 'red';
      case TaskStatus.NotStarted: // intentional fallthrough
      default:
        return '';
    }
  }
}

/** A coloured chip for displaying the status of a task. */
@Component({
  selector: 'status-chip',
  standalone: true,
  imports: [
    CommonModule,
    MatChipsModule,
    MatIconModule,
    StatusDisplayNamePipe,
    StatusColourPipe,
  ],
  templateUrl: './status-chip.html',
  styleUrl: './status-chip.scss',
})
export class StatusChipComponent {
  @Input({ required: true }) status!: TaskStatus;
}
