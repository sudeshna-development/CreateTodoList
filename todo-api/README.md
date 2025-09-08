# Todo API

A simple Todo API built with ASP.NET Core 8.0 that provides RESTful endpoints for managing todo items.

## Prerequisites

Before running this project, ensure you have the following installed:

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- A code editor (Visual Studio, Visual Studio Code, or JetBrains Rider)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd todo-api
```

### 2. Restore Dependencies

```bash
dotnet restore
```

### 3. Run the Application

```bash
dotnet run
```

The API will start and be available at:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`

### 4. Access Swagger Documentation

Once the application is running, you can access the interactive API documentation at:
- `http://localhost:5000/swagger`
- `https://localhost:5001/swagger`

## Project Structure

```
todo-api/
├── Controllers/
│   └── TodosController.cs      # API endpoints for todo operations
├── Models/
│   └── TodoItem.cs            # Todo item data model
├── Services/
│   ├── ITodoService.cs        # Todo service interface
│   └── TodoService.cs         # Todo service implementation
├── TodoApi.Tests/             # Unit tests
│   ├── Controllers/
│   └── Services/
├── Program.cs                 # Application entry point and configuration
└── TodoApi.csproj            # Project file with dependencies
```

## API Endpoints

The API provides the following endpoints:

- `GET /api/todos` - Get all todo items
- `GET /api/todos/{id}` - Get a specific todo item
- `POST /api/todos` - Create a new todo item
- `PUT /api/todos/{id}` - Update an existing todo item
- `DELETE /api/todos/{id}` - Delete a todo item

## Running Tests

To run the unit tests:

```bash
dotnet test
```

## CORS Configuration

The API is configured to allow requests from `http://localhost:4200` (Angular development server). If you need to allow requests from other origins, modify the CORS policy in `Program.cs`.

## Development

### Building the Project

```bash
dotnet build
```

### Running in Development Mode

```bash
dotnet run --environment Development
```

### Watching for Changes (Auto-reload)

```bash
dotnet watch run
```

## Dependencies

- **Microsoft.AspNetCore.OpenApi** (8.0.0) - OpenAPI support
- **Swashbuckle.AspNetCore** (6.4.0) - Swagger documentation
- **Newtonsoft.Json** (13.0.1) - JSON serialization
- **Moq** (4.20.72) - Mocking framework for tests
- **Xunit** (2.9.3) - Unit testing framework

## Troubleshooting

### Port Already in Use
If you encounter a "port already in use" error, you can specify a different port:

```bash
dotnet run --urls "http://localhost:5002"
```

### SSL Certificate Issues
If you encounter SSL certificate issues in development, run:

```bash
dotnet dev-certs https --trust
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests to ensure everything works
5. Submit a pull request