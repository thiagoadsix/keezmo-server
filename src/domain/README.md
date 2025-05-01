# 🧠 Keezmo - Domain Layer

The `domain/` directory is the core of the application, containing all business logic and rules that define what Keezmo does, independent of any external frameworks or implementations. This layer follows Clean Architecture principles to ensure business logic remains pure, testable, and framework-agnostic.

## 📁 Structure

```txt
domain/
├── entities/       # Core business models with identity and behavior
├── errors/         # Domain-specific error types
├── value-objects/  # Immutable objects with validation rules
├── interfaces/     # Contracts for repositories and services
├── services/       # Domain logic not tied to specific entities
└── use-cases/      # Application-specific business flows
```

---

## 📦 `entities/`

Domain models that represent business objects with identity and behavior.

### Example: `user.ts`

```ts
import { Email } from '../value-objects/email';
import { InvalidNameError } from '../errors/invalid-name-error';
import { generateId } from '../../shared/utils/generate-id';

interface UserProps {
  name: string;
  email: Email;
}

export class User {
  public readonly id: string;
  public name: string;
  public email: Email;

  private constructor(id: string, props: UserProps) {
    this.id = id;
    this.name = props.name;
    this.email = props.email;
  }

  public static create(props: UserProps): User {
    if (props.name.trim().length === 0) {
      throw new InvalidNameError(props.name);
    }

    return new User(generateId(), props);
  }

  public static fromPersistence(raw: any): User {
    return new User(
      raw.id,
      {
        name: raw.name,
        email: new Email(raw.email)
      }
    );
  }

  public toPersistence(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      email: this.email.getValue()
    };
  }

  public updateName(newName: string): void {
    if (newName.trim().length === 0) {
      throw new InvalidNameError(newName);
    }
    this.name = newName;
  }
}
```

---

## 📦 `errors/`

Custom error classes that represent domain-specific error conditions.

### Example: `domain-error.ts`

```ts
export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}
```

### Example: `invalid-email-error.ts`

```ts
import { DomainError } from './domain-error';

export class InvalidEmailError extends DomainError {
  constructor(email: string) {
    super(`The email "${email}" is invalid.`);
    Object.setPrototypeOf(this, InvalidEmailError.prototype);
  }
}
```

---

## 📦 `value-objects/`

Immutable objects that represent concepts in the domain with their own validation rules.

### Example: `email.ts`

```ts
import { InvalidEmailError } from '../errors/invalid-email-error';

export class Email {
  private readonly value: string;

  constructor(email: string) {
    const regex = /^[\w\.-]+@([\w\-]+\.)+[\w\-]{2,4}$/;
    if (!regex.test(email)) {
      throw new InvalidEmailError(email);
    }
    this.value = email;
  }

  public getValue(): string {
    return this.value;
  }

  public equals(email: Email): boolean {
    return this.value === email.value;
  }
}
```

---

## 📦 `interfaces/`

Contracts that domain layer expects external layers to implement.

### Example: `user-repository.ts`

```ts
import { User } from '../entities/user';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}
```

---

## 📦 `services/`

Domain logic that doesn't naturally fit within a specific entity.

### Example: `password-service.ts`

```ts
export interface PasswordService {
  hash(password: string): Promise<string>;
  compare(plainText: string, hashed: string): Promise<boolean>;
}
```

---

## 📦 `use-cases/`

Application-specific business logic that orchestrates domain objects to accomplish specific tasks.

### Example: `create-user.usecase.ts`

```ts
import { User } from '../entities/user';
import { Email } from '../value-objects/email';
import { UserRepository } from '../interfaces/user-repository';
import { PasswordService } from '../services/password-service';

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

interface CreateUserResponse {
  id: string;
  name: string;
  email: string;
}

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService
  ) {}

  async execute(data: CreateUserDTO): Promise<CreateUserResponse> {
    const email = new Email(data.email);
    const user = User.create({ name: data.name, email });
    
    // Additional business logic here
    
    await this.userRepository.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email.getValue()
    };
  }
}
```

---

## ✅ Guidelines

- **Isolation**: Domain code must have no dependencies on external frameworks or libraries.
- **Validation**: Entities and value objects should validate their state on creation.
- **Immutability**: Value objects should be immutable.
- **Error Handling**: Use domain-specific error classes for all error conditions.
- **Dependency Inversion**: Domain should define interfaces that infrastructure implements.
- **Testing**: Domain code should be 100% testable without mocks of external dependencies.
- **Naming**: Use domain language consistently in all code (Domain-Driven Design).

---

The domain layer is the heart of the application, containing the core business rules that make Keezmo what it is. This layer should remain stable even as external technologies and requirements change. 