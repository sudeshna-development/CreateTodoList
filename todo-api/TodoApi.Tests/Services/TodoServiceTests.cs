using TodoApi.Models;
using TodoApi.Services;
using Xunit;

namespace TodoApi.Tests.Services;

public class TodoServiceTests
{
    [Fact]
    public async Task GetAllTodosAsync_ReturnsEmptyList_WhenNoTodos()
    {
        // Arrange
        var service = new TodoService();

        // Act
        var result = await service.GetAllTodosAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Empty(result);
    }

    [Fact]
    public async Task CreateTodoAsync_ReturnsCreatedTodo_WithAssignedId()
    {
        // Arrange
        var service = new TodoService();
        var newTodo = new TodoItem { Title = "Test Todo", IsCompleted = false };

        // Act
        var result = await service.CreateTodoAsync(newTodo);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.Id);
        Assert.Equal(newTodo.Title, result.Title);
        Assert.Equal(newTodo.IsCompleted, result.IsCompleted);
        Assert.True(result.CreatedAt <= DateTime.UtcNow);
    }

    [Fact]
    public async Task CreateTodoAsync_AssignsIncrementingIds()
    {
        // Arrange
        var service = new TodoService();
        var todo1 = new TodoItem { Title = "Todo 1", IsCompleted = false };
        var todo2 = new TodoItem { Title = "Todo 2", IsCompleted = false };

        // Act
        var result1 = await service.CreateTodoAsync(todo1);
        var result2 = await service.CreateTodoAsync(todo2);

        // Assert
        Assert.Equal(1, result1.Id);
        Assert.Equal(2, result2.Id);
    }

    [Fact]
    public async Task GetAllTodosAsync_ReturnsAllCreatedTodos()
    {
        // Arrange
        var service = new TodoService();
        var todo1 = new TodoItem { Title = "Todo 1", IsCompleted = false };
        var todo2 = new TodoItem { Title = "Todo 2", IsCompleted = true };

        await service.CreateTodoAsync(todo1);
        await service.CreateTodoAsync(todo2);

        // Act
        var result = await service.GetAllTodosAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
        Assert.Contains(result, t => t.Title == "Todo 1");
        Assert.Contains(result, t => t.Title == "Todo 2");
    }

    [Fact]
    public async Task GetTodoByIdAsync_ReturnsCorrectTodo_WhenTodoExists()
    {
        // Arrange
        var service = new TodoService();
        var todo = new TodoItem { Title = "Test Todo", IsCompleted = false };
        var createdTodo = await service.CreateTodoAsync(todo);

        // Act
        var result = await service.GetTodoByIdAsync(createdTodo.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(createdTodo.Id, result.Id);
        Assert.Equal(createdTodo.Title, result.Title);
        Assert.Equal(createdTodo.IsCompleted, result.IsCompleted);
    }

    [Fact]
    public async Task GetTodoByIdAsync_ReturnsNull_WhenTodoDoesNotExist()
    {
        // Arrange
        var service = new TodoService();

        // Act
        var result = await service.GetTodoByIdAsync(999);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateTodoAsync_UpdatesExistingTodo_WhenTodoExists()
    {
        // Arrange
        var service = new TodoService();
        var originalTodo = new TodoItem { Title = "Original Todo", IsCompleted = false };
        var createdTodo = await service.CreateTodoAsync(originalTodo);

        var updatedTodo = new TodoItem { Title = "Updated Todo", IsCompleted = true };

        // Act
        var result = await service.UpdateTodoAsync(createdTodo.Id, updatedTodo);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(createdTodo.Id, result.Id);
        Assert.Equal(updatedTodo.Title, result.Title);
        Assert.Equal(updatedTodo.IsCompleted, result.IsCompleted);
        Assert.Equal(createdTodo.CreatedAt, result.CreatedAt); // CreatedAt should not change
    }

    [Fact]
    public async Task UpdateTodoAsync_ReturnsNull_WhenTodoDoesNotExist()
    {
        // Arrange
        var service = new TodoService();
        var updatedTodo = new TodoItem { Title = "Updated Todo", IsCompleted = true };

        // Act
        var result = await service.UpdateTodoAsync(999, updatedTodo);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteTodoAsync_ReturnsTrue_WhenTodoExists()
    {
        // Arrange
        var service = new TodoService();
        var todo = new TodoItem { Title = "Test Todo", IsCompleted = false };
        var createdTodo = await service.CreateTodoAsync(todo);

        // Act
        var result = await service.DeleteTodoAsync(createdTodo.Id);

        // Assert
        Assert.True(result);

        // Verify todo is actually deleted
        var deletedTodo = await service.GetTodoByIdAsync(createdTodo.Id);
        Assert.Null(deletedTodo);
    }

    [Fact]
    public async Task DeleteTodoAsync_ReturnsFalse_WhenTodoDoesNotExist()
    {
        // Arrange
        var service = new TodoService();

        // Act
        var result = await service.DeleteTodoAsync(999);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task DeleteTodoAsync_RemovesTodo_FromGetAllTodosAsync()
    {
        // Arrange
        var service = new TodoService();
        var todo1 = new TodoItem { Title = "Todo 1", IsCompleted = false };
        var todo2 = new TodoItem { Title = "Todo 2", IsCompleted = false };

        var createdTodo1 = await service.CreateTodoAsync(todo1);
        var createdTodo2 = await service.CreateTodoAsync(todo2);

        // Act
        await service.DeleteTodoAsync(createdTodo1.Id);
        var remainingTodos = await service.GetAllTodosAsync();

        // Assert
        Assert.Single(remainingTodos);
        Assert.Equal(createdTodo2.Id, remainingTodos.First().Id);
    }
}