import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus } from '../services/tasks-service';

@Pipe({
  name: 'statusDisplayName',
})
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
