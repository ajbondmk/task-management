import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Task {
  id: number;
  name: string;
  created: Date;
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private http = inject(HttpClient);

  createTask(name: string): Observable<any> {
    return this.http.post<any>('http://localhost:8000/createTask/', { name });
  }

  listTasks(): Observable<Task[]> {
    return this.http.get<any[]>('http://localhost:8000/listTasks/').pipe(
      map((tasks) => tasks.map((task) => ({ name: task.name, id: task.id, created: task.created } as Task)))
    );
  }

  deleteTask(id: number): Observable<any> {
    return this.http.post<any>('http://localhost:8000/deleteTask/', { id });
  }
}
