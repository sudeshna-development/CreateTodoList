using TodoApi.Models;

namespace TodoApi.Services;

public interface ITodoService
{
    Task<IEnumerable<TodoItem>> GetAllTodosAsync();
    Task<TodoItem?> GetTodoByIdAsync(int id);
    Task<TodoItem> CreateTodoAsync(TodoItem todoItem);
    Task<TodoItem?> UpdateTodoAsync(int id, TodoItem todoItem);
    Task<bool> DeleteTodoAsync(int id);
}