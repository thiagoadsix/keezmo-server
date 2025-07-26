# 🧱 Keezmo
Transform your notes into flashcards with AI. 

> **Quick Links**
>
> 🇧🇷 **Versão em Português** → [README.pt-br.md](README.pt-br.md)
>
> 📝 **Detailed Documentation**
>
> - [Domain Layer](src/domain/README.md)
> - [Infrastructure Layer](src/infrastructure/README.md)
> - [Shared Layer](src/shared/README.md)

---

## 🚀 Tech Stack

🐢 **Node.js** • 🟦 **TypeScript** • ☁️ **AWS** • 🛠️ **Serverless Framework** • 📦 **AWS CDK**

---

## 📚 Technical Documentation of Directory Structure

Keezmo's structure follows the **Clean Architecture** methodology, providing clarity in the separation of responsibilities, efficient testability, and independence from the frameworks used.

```txt
src/
├── domain/
│   ├── entities/
│   ├── errors/
│   ├── value-objects/
│   ├── interfaces/
│   ├── services/
│   └── use-cases/
|
├── infrastructure/
│   ├── database/
│   │   └── dynamodb/
│   ├── storage (QUEUED)/
│   │   └── s3/
│   └── authentication (QUEUED)/
│       └── clerk/
|
├── presentation/
│   ├── controllers/
│   ├── protocols/
│   └── dtos/
|
├── main/
│   ├── adapters/
│   │   └── aws/
│   │       └── adapt-lambda.ts
│   ├── factories/
│   │   ├── use-cases/
│   │   └── controllers/
│   └── config/
|
├── shared/
│   ├── utils/
│   └── constants/

__tests__/
```

### 🔹 domain/

Contains pure and isolated business rules.

- **entities/** – Entities with their own identity and behaviors.
- **errors/** – Exceptions that live purely in the domain layer.
- **value‑objects/** – Immutable objects with built‑in validation.
- **interfaces/** – Contracts such as `UserRepository`, `Hasher`, etc.
- **services/** – Domain logic that doesn't belong to a specific entity.
- **use‑cases/** – Application use cases that orchestrate domain rules.

### 🔹 infrastructure/

Implements interfaces defined in the domain layer.

- **database/dynamodb/** – AWS DynamoDB implementations of repository interfaces.
- **storage/s3/** – AWS S3 storage adapters (queued).
- **authentication/clerk/** – Clerk.dev authentication services (queued).

### 🔹 presentation/

Contains the presentation layer, including controllers, validators and protocols.

- **controllers/** – Controllers that handle requests and responses.
- **validators/** – Validators for request and response payloads.
- **protocols/** – Communication protocols (REST, GraphQL, etc.).

### 🔹 main/

Contains the main layer, including adapters, factories and config.

- **adapters/** – Adapters for different frameworks.
- **factories/** – Factories for creating objects.
- **config/** – Configuration for the application.

### 🔹 shared/

Reusable, cross‑layer helpers.

- **utils/** – Generic helper functions.
- **constants/** – Global fixed values such as limits, enums, etc.

---

### 🤝 Contributing

Feel free to open issues or pull requests. Let's make learning effortless together!✨
