import {
  HttpClientTestingModule,
  HttpTestingController,
  init_testing as init_testing2
} from "./chunk-TVEEKN2W.js";
import {
  TodoService,
  init_todo_service
} from "./chunk-O3A2BQA7.js";
import {
  TestBed,
  init_testing
} from "./chunk-OKNZXHAD.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-TTULUY32.js";

// src/app/services/todo.service.spec.ts
init_testing();
init_testing2();
init_todo_service();
describe("TodoService", () => {
  let service;
  let httpMock;
  const apiUrl = "http://localhost:5000/api/todos";
  const mockTodos = [
    { id: 1, title: "Test Todo 1", isCompleted: false, createdAt: "2023-01-01T00:00:00Z" },
    { id: 2, title: "Test Todo 2", isCompleted: true, createdAt: "2023-01-02T00:00:00Z" }
  ];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService]
    });
    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });
  it("should be created", () => {
    expect(service).toBeTruthy();
  });
  describe("getTodos", () => {
    it("should return an Observable<TodoItem[]>", () => {
      service.getTodos().subscribe((todos) => {
        expect(todos.length).toBe(2);
        expect(todos).toEqual(mockTodos);
      });
      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe("GET");
      req.flush(mockTodos);
    });
  });
  describe("getTodo", () => {
    it("should return an Observable<TodoItem>", () => {
      const todoId = 1;
      const mockTodo = mockTodos[0];
      service.getTodo(todoId).subscribe((todo) => {
        expect(todo).toEqual(mockTodo);
      });
      const req = httpMock.expectOne(`${apiUrl}/${todoId}`);
      expect(req.request.method).toBe("GET");
      req.flush(mockTodo);
    });
  });
  describe("createTodo", () => {
    it("should create a new todo", () => {
      const newTodo = { title: "New Todo", isCompleted: false };
      const createdTodo = __spreadProps(__spreadValues({ id: 3 }, newTodo), { createdAt: "2023-01-03T00:00:00Z" });
      service.createTodo(newTodo).subscribe((todo) => {
        expect(todo).toEqual(createdTodo);
      });
      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(newTodo);
      req.flush(createdTodo);
    });
  });
  describe("updateTodo", () => {
    it("should update an existing todo", () => {
      const todoId = 1;
      const updateData = { title: "Updated Todo", isCompleted: true };
      const updatedTodo = __spreadProps(__spreadValues({ id: todoId }, updateData), { createdAt: "2023-01-01T00:00:00Z" });
      service.updateTodo(todoId, updateData).subscribe((todo) => {
        expect(todo).toEqual(updatedTodo);
      });
      const req = httpMock.expectOne(`${apiUrl}/${todoId}`);
      expect(req.request.method).toBe("PUT");
      expect(req.request.body).toEqual(updateData);
      req.flush(updatedTodo);
    });
  });
  describe("deleteTodo", () => {
    it("should delete a todo", () => {
      const todoId = 1;
      service.deleteTodo(todoId).subscribe((response) => {
        expect(response).toBeNull();
      });
      const req = httpMock.expectOne(`${apiUrl}/${todoId}`);
      expect(req.request.method).toBe("DELETE");
      req.flush(null);
    });
  });
});
//# sourceMappingURL=spec-app-services-todo.service.spec.js.map
