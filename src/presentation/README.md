# Presentation Layer

This directory contains the presentation layer of the application, which is responsible for handling HTTP requests, mapping them to use cases, and formatting responses.

## Directory Structure

```txt
presentation/
├── controllers/ - HTTP request handlers
├── errors/      - Error handling infrastructure
├── mappers/     - Data transformation between layers
├── protocols/   - Interfaces and contracts
```

## Controllers

Controllers handle HTTP requests and delegate business logic to use cases.

### Controller Architecture

The controller layer follows these design principles:

1. **Separation of Concerns**: Controllers only handle request/response mapping and delegating to use cases
2. **Dependency Injection**: Use cases are injected into controllers
3. **Type Safety**: TypeScript generics ensure type safety between requests and responses
4. **Error Handling**: All domain errors are mapped to appropriate HTTP responses

### Base Controller

The `BaseController` provides a reusable foundation for all controllers. It:

- Implements the `Controller` protocol
- Accepts any use case that follows the `UseCase` interface
- Delegates request handling to the injected use case
- Handles errors and maps them to appropriate HTTP status codes

### Usage Example

```typescript
// 1. Create a controller by extending BaseController
export class CreateUserController extends BaseController<CreateUserRequest, CreateUserResponse> {
  constructor(useCase: UseCase<CreateUserRequest, CreateUserResponse>) {
    super(useCase);
  }
}

// 2. Or use the factory pattern
export const makeCreateUserController = (
  useCase: UseCase<CreateUserRequest, CreateUserResponse>
): Controller<HttpRequest<CreateUserRequest>, HttpResponse<CreateUserResponse>> => {
  return new CreateUserController(useCase);
};

// 3. Example use with an Express adapter
app.post('/users', expressAdapter(makeCreateUserController(createUserUseCase)));
```

## Error Handling

### Error Hierarchy

```txt
DomainError (Base class)
├── ValidationError
├── NotFoundError
├── UnauthorizedError
├── ForbiddenError
└── ConflictError
```

### Error Mapper

The `ErrorMapper` is responsible for mapping domain errors to HTTP responses:

| Domain Error        | HTTP Status Code    |
| ------------------- | ------------------- |
| ValidationError     | 400 Bad Request     |
| NotFoundError       | 404 Not Found       |
| UnauthorizedError   | 401 Unauthorized    |
| ForbiddenError      | 403 Forbidden       |
| ConflictError       | 409 Conflict        |
| DomainError (other) | 422 Unprocessable   |
| Any other error     | 500 Internal Server |

Controllers don't need to handle errors directly. The `BaseController` catches all errors and maps them to appropriate HTTP responses using the `ErrorMapper`:

```typescript
async handle(request: HttpRequest<Request>): Promise<HttpResponse<Response>> {
  try {
    const result = await this.useCase.execute(request.body as Request);
    return ok<Response>(result);
  } catch (error) {
    return ErrorMapper.toHttpResponse(error) as HttpResponse<Response>;
  }
}
```

### Express Error Middleware

The Express adapter includes an error middleware that uses the `ErrorMapper` to handle all errors:

```typescript
export const errorMiddleware = (error: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('[Error Handler]', error);

  const httpResponse = ErrorMapper.toHttpResponse(error);

  res.status(httpResponse.statusCode).json(httpResponse.body);
};
```

## Complete Example with Error Handling

```typescript
// src/domain/use-cases/user/create-user.usecase.ts
export class CreateUserUseCase implements UseCase<CreateUserRequest, CreateUserResponse> {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    // Validation logic
    if (!request.email) {
      throw new ValidationError('Email is required');
    }

    // Check for existing user
    const existingUser = await this.userRepo.findByEmail(request.email);
    if (existingUser) {
      throw new ConflictError('User', 'email', request.email);
    }

    // Create user logic...
    // ...

    return {
      id: 'new-user-id',
      name: request.name,
      email: request.email,
      createdAt: new Date(),
    };
  }
}
```

## Best Practices

1. **Throw Domain Errors**: Throw specific domain errors rather than generic errors
2. **Include Context**: Include relevant context in error messages
3. **Don't Catch Domain Errors**: Let them propagate to the controller for proper handling
4. **Log Unexpected Errors**: Log unexpected errors for debugging
5. **Don't Expose Internals**: Don't expose internal error details to clients
6. **Reusability**: Use base controllers for common controller logic
7. **Consistency**: Follow established patterns across all controllers
8. **Testability**: Design for easy mocking of use cases in controller tests
9. **Framework Agnosticism**: Keep controllers independent of the HTTP framework
