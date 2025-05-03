# 🧱 Keezmo - Shared Layer

The `shared/` directory in Keezmo contains utility code and constants that are used across multiple layers of the application. This layer promotes reuse, reduces duplication, and keeps domain logic clean by extracting infrastructure-agnostic helpers and shared definitions.

## 📁 Structure

```txt
shared/
├── utils/         # Generic utility functions
│   └── generate-id.ts
├── constants/     # Application-wide constants
│   └── app.ts
```

---

## 📦 `utils/`

Utility modules that perform framework-independent, side-effect-free operations. These are helpers that can be reused throughout the application.

### Example: `generate-id.ts`

```ts
import { randomUUID } from 'crypto';

export function generateId(): string {
  return randomUUID();
}
```

Use this in domain entities:

```ts
import { generateId } from '@/shared/utils/generate-id';
```

---

## 📦 `constants/`

Centralized definitions of global constants that must be consistent across environments, like enums, configuration keys, or static identifiers.

### Example: `app.ts`

```ts
export const APP_NAME = 'Keezmo';
export const DEFAULT_LANGUAGE = 'en';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export const MAX_ATTEMPTS = 3;
export const TOKEN_EXPIRATION_DAYS = 7;
```

---

## ✅ Guidelines

- Do **not** add business logic here.
- Use `shared/` only for reusable, stateless, side-effect-free helpers and constants.
- Keep the API of utilities minimal and stable.
- When a utility becomes specific to one domain, **move it** to `domain/services`.
- Prefer TypeScript's type system (interfaces, enums, etc.) to document the intent of shared code.
- Write comprehensive tests for all utility functions to ensure reliability.

---

This layer empowers code reuse and helps enforce a clean separation of concerns within the architecture.
