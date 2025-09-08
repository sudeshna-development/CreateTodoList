import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { TodoItem } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos: TodoItem[] = [];
  newTodoTitle: string = '';
  isLoading: boolean = false;
  editingTodoId: number | null = null;
  editingTitle: string = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.isLoading = true;
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading todos:', error);
        this.isLoading = false;
      }
    });
  }

  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      const newTodo = {
        title: this.newTodoTitle.trim(),
        isCompleted: false
      };

      this.todoService.createTodo(newTodo).subscribe({
        next: (todo) => {
          this.todos.push(todo);
          this.newTodoTitle = '';
        },
        error: (error) => {
          console.error('Error creating todo:', error);
        }
      });
    }
  }

  toggleTodo(todo: TodoItem): void {
    const updatedTodo = {
      title: todo.title,
      isCompleted: !todo.isCompleted
    };

    this.todoService.updateTodo(todo.id, updatedTodo).subscribe({
      next: (updated) => {
        const index = this.todos.findIndex(t => t.id === todo.id);
        if (index !== -1) {
          this.todos[index] = updated;
        }
      },
      error: (error) => {
        console.error('Error updating todo:', error);
      }
    });
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.todos = this.todos.filter(todo => todo.id !== id);
      },
      error: (error) => {
        console.error('Error deleting todo:', error);
      }
    });
  }

  startEdit(todo: TodoItem): void {
    this.editingTodoId = todo.id;
    this.editingTitle = todo.title;
  }

  cancelEdit(): void {
    this.editingTodoId = null;
    this.editingTitle = '';
  }

  saveEdit(todo: TodoItem): void {
    if (this.editingTitle.trim()) {
      const updatedTodo = {
        title: this.editingTitle.trim(),
        isCompleted: todo.isCompleted
      };

      this.todoService.updateTodo(todo.id, updatedTodo).subscribe({
        next: (updated) => {
          const index = this.todos.findIndex(t => t.id === todo.id);
          if (index !== -1) {
            this.todos[index] = updated;
          }
          this.cancelEdit();
        },
        error: (error) => {
          console.error('Error updating todo:', error);
        }
      });
    }
  }

  isEditing(todoId: number): boolean {
    return this.editingTodoId === todoId;
  }
}