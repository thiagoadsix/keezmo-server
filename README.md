# 🧱 Keezmo

> **Quick Links**
>
> 🇧🇷 **Versão em Português** → [README.pt-br.md](README.pt-br.md)

---

## 🚀 Tech Stack

🐢 **Node.js** • 🟦 **TypeScript** • ☁️ **AWS** • 🛠️ **Serverless Framework** • 📦 **AWS CDK**

---

## 📚 Technical Documentation of Directory Structure

Keezmo’s structure follows the **Clean Architecture** methodology, providing clarity in the separation of responsibilities, efficient testability, and independence from the frameworks used.

```txt
src/
├── domain/
│   ├── entities/
│   ├── errors/
│   ├── value-objects/
│   ├── interfaces/
│   ├── services/
│   └── use-cases/
├── shared/
│   ├── utils/
│   └── constants/

__tests__/
```

### 🔹 domain/
Contains pure and isolated business rules.

- **entities/** – Entities with their own identity and behaviors.
- **errors/** – Exceptions that live purely in the domain layer.
- **value‑objects/** – Immutable objects with built‑in validation.
- **interfaces/** – Contracts such as `UserRepository`, `Hasher`, etc.
- **services/** – Domain logic that doesn’t belong to a specific entity.
- **use‑cases/** – Application use cases that orchestrate domain rules.

### 🔹 shared/
Reusable, cross‑layer helpers.

- **utils/** – Generic helper functions.
- **constants/** – Global fixed values such as limits, enums, etc.

---

### 🤝 Contributing
Feel free to open issues or pull requests. Let’s make learning effortless together!✨

