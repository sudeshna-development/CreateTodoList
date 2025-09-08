using TodoApi.Models;

namespace TodoApi.Services;

public class TodoService : ITodoService
{
    private readonly List<TodoItem> _todos = new();
    private int _nextId = 1;

    public Task<IEnumerable<TodoItem>> GetAllTodosAsync()
    {
        return Task.FromResult(_todos.AsEnumerable());
    }

    public Task<TodoItem?> GetTodoByIdAsync(int id)
    {
        var todo = _todos.FirstOrDefault(t => t.Id == id);
        return Task.FromResult(todo);
    }

    public Task<TodoItem> CreateTodoAsync(TodoItem todoItem)
    {
        todoItem.Id = _nextId++;
        todoItem.CreatedAt = DateTime.UtcNow;
        _todos.Add(todoItem);
        return Task.FromResult(todoItem);
    }

    public Task<TodoItem?> UpdateTodoAsync(int id, TodoItem todoItem)
    {
        var existingTodo = _todos.FirstOrDefault(t => t.Id == id);
        if (existingTodo == null)
            return Task.FromResult<TodoItem?>(null);

        existingTodo.Title = todoItem.Title;
        existingTodo.IsCompleted = todoItem.IsCompleted;
        return Task.FromResult<TodoItem?>(existingTodo);
    }

    public Task<bool> DeleteTodoAsync(int id)
    {
        var todo = _todos.FirstOrDefault(t => t.Id == id);
        if (todo == null)
            return Task.FromResult(false);

        _todos.Remove(todo);
        return Task.FromResult(true);
    }
}