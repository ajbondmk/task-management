import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

interface Task {
  id: number;
  name: string;
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
      map((tasks) => tasks.map((task) => ({ name: task.name, id: task.id } as Task)))
    );
  }
}
