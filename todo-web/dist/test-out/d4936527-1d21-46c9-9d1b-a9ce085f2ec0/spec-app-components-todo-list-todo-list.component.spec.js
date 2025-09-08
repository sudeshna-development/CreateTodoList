import {
  FormsModule,
  TodoListComponent,
  init_forms,
  init_todo_list_component
} from "./chunk-4JEQJBW4.js";
import {
  TodoService,
  init_todo_service
} from "./chunk-O3A2BQA7.js";
import "./chunk-5Q3GPVZL.js";
import {
  TestBed,
  init_esm,
  init_testing,
  of,
  throwError
} from "./chunk-OKNZXHAD.js";
import {
  __async,
  __commonJS,
  __spreadProps,
  __spreadValues
} from "./chunk-TTULUY32.js";

// src/app/components/todo-list/todo-list.component.spec.ts
var require_todo_list_component_spec = __commonJS({
  "src/app/components/todo-list/todo-list.component.spec.ts"(exports) {
    init_testing();
    init_forms();
    init_esm();
    init_todo_list_component();
    init_todo_service();
    describe("TodoListComponent", () => {
      let component;
      let fixture;
      let todoServiceSpy;
      const mockTodos = [
        { id: 1, title: "Test Todo 1", isCompleted: false, createdAt: "2023-01-01T00:00:00Z" },
        { id: 2, title: "Test Todo 2", isCompleted: true, createdAt: "2023-01-02T00:00:00Z" }
      ];
      beforeEach(() => __async(null, null, function* () {
        const spy = jasmine.createSpyObj("TodoService", ["getTodos", "createTodo", "updateTodo", "deleteTodo"]);
        yield TestBed.configureTestingModule({
          imports: [TodoListComponent, FormsModule],
          providers: [
            { provide: TodoService, useValue: spy }
          ]
        }).compileComponents();
        fixture = TestBed.createComponent(TodoListComponent);
        component = fixture.componentInstance;
        todoServiceSpy = TestBed.inject(TodoService);
      }));
      it("should create", () => {
        expect(component).toBeTruthy();
      });
      describe("ngOnInit", () => {
        it("should load todos on initialization", () => {
          todoServiceSpy.getTodos.and.returnValue(of(mockTodos));
          component.ngOnInit();
          expect(todoServiceSpy.getTodos).toHaveBeenCalled();
          expect(component.todos).toEqual(mockTodos);
          expect(component.isLoading).toBeFalse();
        });
        it("should handle error when loading todos", () => {
          const consoleErrorSpy = spyOn(console, "error");
          todoServiceSpy.getTodos.and.returnValue(throwError(() => new Error("API Error")));
          component.ngOnInit();
          expect(todoServiceSpy.getTodos).toHaveBeenCalled();
          expect(component.isLoading).toBeFalse();
          expect(consoleErrorSpy).toHaveBeenCalledWith("Error loading todos:", jasmine.any(Error));
        });
      });
      describe("addTodo", () => {
        it("should add a new todo", () => {
          const newTodo = { title: "New Todo", isCompleted: false };
          const createdTodo = __spreadProps(__spreadValues({ id: 3 }, newTodo), { createdAt: "2023-01-03T00:00:00Z" });
          todoServiceSpy.createTodo.and.returnValue(of(createdTodo));
          component.newTodoTitle = "New Todo";
          component.addTodo();
          expect(todoServiceSpy.createTodo).toHaveBeenCalledWith(newTodo);
          expect(component.todos).toContain(createdTodo);
          expect(component.newTodoTitle).toBe("");
        });
        it("should not add empty todo", () => {
          component.newTodoTitle = "   ";
          component.addTodo();
          expect(todoServiceSpy.createTodo).not.toHaveBeenCalled();
        });
        it("should handle error when creating todo", () => {
          const consoleErrorSpy = spyOn(console, "error");
          todoServiceSpy.createTodo.and.returnValue(throwError(() => new Error("API Error")));
          component.newTodoTitle = "New Todo";
          component.addTodo();
          expect(consoleErrorSpy).toHaveBeenCalledWith("Error creating todo:", jasmine.any(Error));
        });
      });
      describe("toggleTodo", () => {
        it("should toggle todo completion status", () => {
          const todo = mockTodos[0];
          const updatedTodo = __spreadProps(__spreadValues({}, todo), { isCompleted: !todo.isCompleted });
          todoServiceSpy.updateTodo.and.returnValue(of(updatedTodo));
          component.todos = [...mockTodos];
          component.toggleTodo(todo);
          expect(todoServiceSpy.updateTodo).toHaveBeenCalledWith(todo.id, {
            title: todo.title,
            isCompleted: !todo.isCompleted
          });
          expect(component.todos[0]).toEqual(updatedTodo);
        });
        it("should handle error when toggling todo", () => {
          const consoleErrorSpy = spyOn(console, "error");
          const todo = mockTodos[0];
          todoServiceSpy.updateTodo.and.returnValue(throwError(() => new Error("API Error")));
          component.toggleTodo(todo);
          expect(consoleErrorSpy).toHaveBeenCalledWith("Error updating todo:", jasmine.any(Error));
        });
      });
      describe("deleteTodo", () => {
        it("should delete a todo", () => {
          todoServiceSpy.deleteTodo.and.returnValue(of(void 0));
          component.todos = [...mockTodos];
          component.deleteTodo(1);
          expect(todoServiceSpy.deleteTodo).toHaveBeenCalledWith(1);
          expect(component.todos.length).toBe(1);
          expect(component.todos.find((t) => t.id === 1)).toBeUndefined();
        });
        it("should handle error when deleting todo", () => {
          const consoleErrorSpy = spyOn(console, "error");
          todoServiceSpy.deleteTodo.and.returnValue(throwError(() => new Error("API Error")));
          component.deleteTodo(1);
          expect(consoleErrorSpy).toHaveBeenCalledWith("Error deleting todo:", jasmine.any(Error));
        });
      });
      describe("editing functionality", () => {
        it("should start edit mode", () => {
          const todo = mockTodos[0];
          component.startEdit(todo);
          expect(component.editingTodoId).toBe(todo.id);
          expect(component.editingTitle).toBe(todo.title);
        });
        it("should cancel edit mode", () => {
          component.editingTodoId = 1;
          component.editingTitle = "Editing title";
          component.cancelEdit();
          expect(component.editingTodoId).toBeNull();
          expect(component.editingTitle).toBe("");
        });
        it("should save edit", () => {
          const todo = mockTodos[0];
          const updatedTodo = __spreadProps(__spreadValues({}, todo), { title: "Updated Title" });
          todoServiceSpy.updateTodo.and.returnValue(of(updatedTodo));
          component.todos = [...mockTodos];
          component.editingTodoId = todo.id;
          component.editingTitle = "Updated Title";
          component.saveEdit(todo);
          expect(todoServiceSpy.updateTodo).toHaveBeenCalledWith(todo.id, {
            title: "Updated Title",
            isCompleted: todo.isCompleted
          });
          expect(component.todos[0]).toEqual(updatedTodo);
          expect(component.editingTodoId).toBeNull();
          expect(component.editingTitle).toBe("");
        });
        it("should not save empty edit", () => {
          const todo = mockTodos[0];
          component.editingTitle = "   ";
          component.saveEdit(todo);
          expect(todoServiceSpy.updateTodo).not.toHaveBeenCalled();
        });
        it("should handle error when saving edit", () => {
          const consoleErrorSpy = spyOn(console, "error");
          const todo = mockTodos[0];
          todoServiceSpy.updateTodo.and.returnValue(throwError(() => new Error("API Error")));
          component.editingTitle = "Updated Title";
          component.saveEdit(todo);
          expect(consoleErrorSpy).toHaveBeenCalledWith("Error updating todo:", jasmine.any(Error));
        });
        it("should check if todo is being edited", () => {
          component.editingTodoId = 1;
          expect(component.isEditing(1)).toBeTrue();
          expect(component.isEditing(2)).toBeFalse();
        });
      });
    });
  }
});
export default require_todo_list_component_spec();
//# sourceMappingURL=spec-app-components-todo-list-todo-list.component.spec.js.map
