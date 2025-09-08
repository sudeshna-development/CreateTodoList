using Microsoft.AspNetCore.Mvc;
using TodoApi.Models;
using TodoApi.Services;

namespace TodoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private readonly ITodoService _todoService;

    public TodosController(ITodoService todoService)
    {
        _todoService = todoService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodos()
    {
        var todos = await _todoService.GetAllTodosAsync();
        return Ok(todos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TodoItem>> GetTodo(int id)
    {
        var todo = await _todoService.GetTodoByIdAsync(id);
        if (todo == null)
        {
            return NotFound();
        }
        return Ok(todo);
    }

    [HttpPost]
    public async Task<ActionResult<TodoItem>> CreateTodo(TodoItem todoItem)
    {
        var createdTodo = await _todoService.CreateTodoAsync(todoItem);
        return CreatedAtAction(nameof(GetTodo), new { id = createdTodo.Id }, createdTodo);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TodoItem>> UpdateTodo(int id, TodoItem todoItem)
    {
        var updatedTodo = await _todoService.UpdateTodoAsync(id, todoItem);
        if (updatedTodo == null)
        {
            return NotFound();
        }
        return Ok(updatedTodo);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTodo(int id)
    {
        var deleted = await _todoService.DeleteTodoAsync(id);
        if (!deleted)
        {
            return NotFound();
        }
        return NoContent();
    }
}