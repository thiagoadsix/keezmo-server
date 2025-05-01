# 🏗️ Keezmo - Infrastructure Layer

The `infrastructure/` directory contains implementations of interfaces defined in the domain layer. This layer handles interactions with external systems, databases, APIs, and other services, allowing the domain layer to remain pure and focused on business logic.

## 📁 Structure

```txt
infrastructure/
├── database/           # Database implementations
│   └── dynamodb/       # AWS DynamoDB adapters
├── storage/            # File storage implementations (queued)
│   └── s3/             # AWS S3 storage adapters
├── authentication/     # Auth service implementations (queued)
│   └── clerk/          # Clerk.dev auth adapter
└── ... other external services
```

---

## 📦 `database/dynamodb/`

Provides DynamoDB implementations of repository interfaces defined in the domain.

### Example: `user-repository.ts`

```ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { User } from '@/domain/entities/user';
import { UserRepository } from '@/domain/interfaces/user-repository';

export class DynamoDBUserRepository implements UserRepository {
  private readonly tableName = 'users';
  private readonly docClient: DynamoDBDocumentClient;

  constructor() {
    const client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(client);
  }

  async findById(id: string): Promise<User | null> {
    const response = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { id }
      })
    );

    if (!response.Item) return null;
    
    // Convert DynamoDB item to domain entity
    return User.fromPersistence(response.Item);
  }

  async save(user: User): Promise<void> {
    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: user.toPersistence()
      })
    );
  }

  async delete(id: string): Promise<void> {
    await this.docClient.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { id }
      })
    );
  }
}
```

---

## 📦 `storage/s3/` (Queued)

Storage adapters that implement file storage interfaces using AWS S3.

## 📦 `authentication/clerk/` (Queued)

Authentication adapters that implement auth interfaces using Clerk.dev services.

---

## ✅ Guidelines

- Each infrastructure implementation **must implement** a corresponding domain interface.
- Keep domain entities isolated - convert between persistence models and domain models at the boundary.
- Infrastructure implementations should handle all external concerns like:
  - Connection management
  - Error translation from external errors to domain errors
  - Serialization/deserialization
  - External service configuration
- Use dependency injection to allow swapping implementations (e.g., for testing)
- Infrastructure code should be covered by integration tests

---

This layer ensures that external dependencies are properly isolated from the domain logic, making the system more maintainable and adaptable to changes in external services. 