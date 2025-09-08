import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from '../../services/todo.service';
import { TodoItem } from '../../models/todo.model';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let todoServiceSpy: jasmine.SpyObj<TodoService>;

  const mockTodos: TodoItem[] = [
    { id: 1, title: 'Test Todo 1', isCompleted: false, createdAt: '2023-01-01T00:00:00Z' },
    { id: 2, title: 'Test Todo 2', isCompleted: true, createdAt: '2023-01-02T00:00:00Z' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TodoService', ['getTodos', 'createTodo', 'updateTodo', 'deleteTodo']);

    await TestBed.configureTestingModule({
      imports: [TodoListComponent, FormsModule],
      providers: [
        { provide: TodoService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    todoServiceSpy = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load todos on initialization', () => {
      todoServiceSpy.getTodos.and.returnValue(of(mockTodos));

      component.ngOnInit();

      expect(todoServiceSpy.getTodos).toHaveBeenCalled();
      expect(component.todos).toEqual(mockTodos);
      expect(component.isLoading).toBeFalse();
    });

    it('should handle error when loading todos', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      todoServiceSpy.getTodos.and.returnValue(throwError(() => new Error('API Error')));

      component.ngOnInit();

      expect(todoServiceSpy.getTodos).toHaveBeenCalled();
      expect(component.isLoading).toBeFalse();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading todos:', jasmine.any(Error));
    });
  });

  describe('addTodo', () => {
    it('should add a new todo', () => {
      const newTodo = { title: 'New Todo', isCompleted: false };
      const createdTodo: TodoItem = { id: 3, ...newTodo, createdAt: '2023-01-03T00:00:00Z' };
      
      todoServiceSpy.createTodo.and.returnValue(of(createdTodo));
      component.newTodoTitle = 'New Todo';

      component.addTodo();

      expect(todoServiceSpy.createTodo).toHaveBeenCalledWith(newTodo);
      expect(component.todos).toContain(createdTodo);
      expect(component.newTodoTitle).toBe('');
    });

    it('should not add empty todo', () => {
      component.newTodoTitle = '   ';

      component.addTodo();

      expect(todoServiceSpy.createTodo).not.toHaveBeenCalled();
    });

    it('should handle error when creating todo', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      todoServiceSpy.createTodo.and.returnValue(throwError(() => new Error('API Error')));
      component.newTodoTitle = 'New Todo';

      component.addTodo();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating todo:', jasmine.any(Error));
    });
  });

  describe('toggleTodo', () => {
    it('should toggle todo completion status', () => {
      const todo = mockTodos[0];
      const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
      todoServiceSpy.updateTodo.and.returnValue(of(updatedTodo));
      component.todos = [...mockTodos];

      component.toggleTodo(todo);

      expect(todoServiceSpy.updateTodo).toHaveBeenCalledWith(todo.id, {
        title: todo.title,
        isCompleted: !todo.isCompleted
      });
      expect(component.todos[0]).toEqual(updatedTodo);
    });

    it('should handle error when toggling todo', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      const todo = mockTodos[0];
      todoServiceSpy.updateTodo.and.returnValue(throwError(() => new Error('API Error')));

      component.toggleTodo(todo);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating todo:', jasmine.any(Error));
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', () => {
      todoServiceSpy.deleteTodo.and.returnValue(of(undefined));
      component.todos = [...mockTodos];

      component.deleteTodo(1);

      expect(todoServiceSpy.deleteTodo).toHaveBeenCalledWith(1);
      expect(component.todos.length).toBe(1);
      expect(component.todos.find(t => t.id === 1)).toBeUndefined();
    });

    it('should handle error when deleting todo', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      todoServiceSpy.deleteTodo.and.returnValue(throwError(() => new Error('API Error')));

      component.deleteTodo(1);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error deleting todo:', jasmine.any(Error));
    });
  });

  describe('editing functionality', () => {
    it('should start edit mode', () => {
      const todo = mockTodos[0];

      component.startEdit(todo);

      expect(component.editingTodoId).toBe(todo.id);
      expect(component.editingTitle).toBe(todo.title);
    });

    it('should cancel edit mode', () => {
      component.editingTodoId = 1;
      component.editingTitle = 'Editing title';

      component.cancelEdit();

      expect(component.editingTodoId).toBeNull();
      expect(component.editingTitle).toBe('');
    });

    it('should save edit', () => {
      const todo = mockTodos[0];
      const updatedTodo = { ...todo, title: 'Updated Title' };
      todoServiceSpy.updateTodo.and.returnValue(of(updatedTodo));
      component.todos = [...mockTodos];
      component.editingTodoId = todo.id;
      component.editingTitle = 'Updated Title';

      component.saveEdit(todo);

      expect(todoServiceSpy.updateTodo).toHaveBeenCalledWith(todo.id, {
        title: 'Updated Title',
        isCompleted: todo.isCompleted
      });
      expect(component.todos[0]).toEqual(updatedTodo);
      expect(component.editingTodoId).toBeNull();
      expect(component.editingTitle).toBe('');
    });

    it('should not save empty edit', () => {
      const todo = mockTodos[0];
      component.editingTitle = '   ';

      component.saveEdit(todo);

      expect(todoServiceSpy.updateTodo).not.toHaveBeenCalled();
    });

    it('should handle error when saving edit', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      const todo = mockTodos[0];
      todoServiceSpy.updateTodo.and.returnValue(throwError(() => new Error('API Error')));
      component.editingTitle = 'Updated Title';

      component.saveEdit(todo);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating todo:', jasmine.any(Error));
    });

    it('should check if todo is being edited', () => {
      component.editingTodoId = 1;

      expect(component.isEditing(1)).toBeTrue();
      expect(component.isEditing(2)).toBeFalse();
    });
  });
});