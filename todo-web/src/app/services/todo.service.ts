import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TodoItem } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly apiUrl = 'http://localhost:5000/api/todos';

  constructor(private http: HttpClient) {}

  getTodos(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(this.apiUrl);
  }

  getTodo(id: number): Observable<TodoItem> {
    return this.http.get<TodoItem>(`${this.apiUrl}/${id}`);
  }

  createTodo(todo: Omit<TodoItem, 'id' | 'createdAt'>): Observable<TodoItem> {
    return this.http.post<TodoItem>(this.apiUrl, todo);
  }

  updateTodo(id: number, todo: Omit<TodoItem, 'id' | 'createdAt'>): Observable<TodoItem> {
    return this.http.put<TodoItem>(`${this.apiUrl}/${id}`, todo);
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}