using Microsoft.AspNetCore.Mvc;
using Moq;
using TodoApi.Controllers;
using TodoApi.Models;
using TodoApi.Services;
using Xunit;

namespace TodoApi.Tests.Controllers;

public class TodosControllerTests
{
    private readonly Mock<ITodoService> _mockTodoService;
    private readonly TodosController _controller;

    public TodosControllerTests()
    {
        _mockTodoService = new Mock<ITodoService>();
        _controller = new TodosController(_mockTodoService.Object);
    }

    [Fact]
    public async Task GetTodos_ReturnsOkResult_WithListOfTodos()
    {
        // Arrange
        var expectedTodos = new List<TodoItem>
        {
            new TodoItem { Id = 1, Title = "Test Todo 1", IsCompleted = false, CreatedAt = DateTime.UtcNow },
            new TodoItem { Id = 2, Title = "Test Todo 2", IsCompleted = true, CreatedAt = DateTime.UtcNow }
        };
        _mockTodoService.Setup(s => s.GetAllTodosAsync()).ReturnsAsync(expectedTodos);

        // Act
        var result = await _controller.GetTodos();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var todos = Assert.IsAssignableFrom<IEnumerable<TodoItem>>(okResult.Value);
        Assert.Equal(2, todos.Count());
        _mockTodoService.Verify(s => s.GetAllTodosAsync(), Times.Once);
    }

    [Fact]
    public async Task GetTodo_WithValidId_ReturnsOkResult_WithTodo()
    {
        // Arrange
        var todoId = 1;
        var expectedTodo = new TodoItem { Id = todoId, Title = "Test Todo", IsCompleted = false, CreatedAt = DateTime.UtcNow };
        _mockTodoService.Setup(s => s.GetTodoByIdAsync(todoId)).ReturnsAsync(expectedTodo);

        // Act
        var result = await _controller.GetTodo(todoId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var todo = Assert.IsType<TodoItem>(okResult.Value);
        Assert.Equal(expectedTodo.Id, todo.Id);
        Assert.Equal(expectedTodo.Title, todo.Title);
        _mockTodoService.Verify(s => s.GetTodoByIdAsync(todoId), Times.Once);
    }

    [Fact]
    public async Task GetTodo_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var todoId = 999;
        _mockTodoService.Setup(s => s.GetTodoByIdAsync(todoId)).ReturnsAsync((TodoItem?)null);

        // Act
        var result = await _controller.GetTodo(todoId);

        // Assert
        Assert.IsType<NotFoundResult>(result.Result);
        _mockTodoService.Verify(s => s.GetTodoByIdAsync(todoId), Times.Once);
    }

    [Fact]
    public async Task CreateTodo_WithValidTodo_ReturnsCreatedAtActionResult()
    {
        // Arrange
        var newTodo = new TodoItem { Title = "New Todo", IsCompleted = false };
        var createdTodo = new TodoItem { Id = 1, Title = "New Todo", IsCompleted = false, CreatedAt = DateTime.UtcNow };
        _mockTodoService.Setup(s => s.CreateTodoAsync(newTodo)).ReturnsAsync(createdTodo);

        // Act
        var result = await _controller.CreateTodo(newTodo);

        // Assert
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        var todo = Assert.IsType<TodoItem>(createdAtActionResult.Value);
        Assert.Equal(createdTodo.Id, todo.Id);
        Assert.Equal(createdTodo.Title, todo.Title);
        Assert.Equal(nameof(TodosController.GetTodo), createdAtActionResult.ActionName);
        Assert.Equal(createdTodo.Id, createdAtActionResult.RouteValues!["id"]);
        _mockTodoService.Verify(s => s.CreateTodoAsync(newTodo), Times.Once);
    }

    [Fact]
    public async Task UpdateTodo_WithValidIdAndTodo_ReturnsOkResult_WithUpdatedTodo()
    {
        // Arrange
        var todoId = 1;
        var todoToUpdate = new TodoItem { Title = "Updated Todo", IsCompleted = true };
        var updatedTodo = new TodoItem { Id = todoId, Title = "Updated Todo", IsCompleted = true, CreatedAt = DateTime.UtcNow };
        _mockTodoService.Setup(s => s.UpdateTodoAsync(todoId, todoToUpdate)).ReturnsAsync(updatedTodo);

        // Act
        var result = await _controller.UpdateTodo(todoId, todoToUpdate);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var todo = Assert.IsType<TodoItem>(okResult.Value);
        Assert.Equal(updatedTodo.Id, todo.Id);
        Assert.Equal(updatedTodo.Title, todo.Title);
        Assert.Equal(updatedTodo.IsCompleted, todo.IsCompleted);
        _mockTodoService.Verify(s => s.UpdateTodoAsync(todoId, todoToUpdate), Times.Once);
    }

    [Fact]
    public async Task UpdateTodo_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var todoId = 999;
        var todoToUpdate = new TodoItem { Title = "Updated Todo", IsCompleted = true };
        _mockTodoService.Setup(s => s.UpdateTodoAsync(todoId, todoToUpdate)).ReturnsAsync((TodoItem?)null);

        // Act
        var result = await _controller.UpdateTodo(todoId, todoToUpdate);

        // Assert
        Assert.IsType<NotFoundResult>(result.Result);
        _mockTodoService.Verify(s => s.UpdateTodoAsync(todoId, todoToUpdate), Times.Once);
    }

    [Fact]
    public async Task DeleteTodo_WithValidId_ReturnsNoContent()
    {
        // Arrange
        var todoId = 1;
        _mockTodoService.Setup(s => s.DeleteTodoAsync(todoId)).ReturnsAsync(true);

        // Act
        var result = await _controller.DeleteTodo(todoId);

        // Assert
        Assert.IsType<NoContentResult>(result);
        _mockTodoService.Verify(s => s.DeleteTodoAsync(todoId), Times.Once);
    }

    [Fact]
    public async Task DeleteTodo_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var todoId = 999;
        _mockTodoService.Setup(s => s.DeleteTodoAsync(todoId)).ReturnsAsync(false);

        // Act
        var result = await _controller.DeleteTodo(todoId);

        // Assert
        Assert.IsType<NotFoundResult>(result);
        _mockTodoService.Verify(s => s.DeleteTodoAsync(todoId), Times.Once);
    }
}