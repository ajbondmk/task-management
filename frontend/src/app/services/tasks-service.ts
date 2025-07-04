import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Task {
  id: number;
  name: string;
  description: string;
  created: Date;
  status: TaskStatus;
  progressPercentage: number;
  results: string;
}

export enum TaskStatus {
  NotStarted = 1,
  InProgress = 2,
  Completed = 3,
  Paused = 4,
  Cancelled = 5,
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private http = inject(HttpClient);

  createTask(name: string, description: string): Observable<any> {
    return this.http.post<any>('http://localhost:8000/createTask/', {
      name,
      description,
    });
  }

  listTasks(): Observable<Task[]> {
    return this.http.get<any[]>('http://localhost:8000/listTasks/').pipe(
      map((tasks) =>
        tasks.map(
          (task) =>
            ({
              id: task.id,
              name: task.name,
              description: task.description,
              created: task.created,
              status: task.status,
              progressPercentage: task.progressPercentage,
              results: task.results,
            } as Task)
        )
      )
    );
  }

  deleteTask(id: number): Observable<any> {
    return this.http.post<any>('http://localhost:8000/deleteTask/', { id });
  }

  updateTask(id: number, name: string, description: string): Observable<any> {
    return this.http.post<any>('http://localhost:8000/updateTask/', {
      id,
      name,
      description,
    });
  }

  updateTaskStatus(id: number, status: TaskStatus): Observable<any> {
    return this.http.post<any>('http://localhost:8000/updateTaskStatus/', {
      id,
      status,
    });
  }
}
