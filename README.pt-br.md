# 🧱 Keezmo

> **Links Rápidos**
>
> 🇺🇸 **English Version** → [README.md](README.md)

---

## 🚀 Stack

🐢 **Node.js** • 🟦 **TypeScript** • ☁️ **AWS** • 🛠️ **Serverless Framework** • 📦 **AWS CDK**

---

## 📚 Documentação Técnica da Estrutura de Diretórios

A estrutura do Keezmo segue a **Clean Architecture**, proporcionando clareza na separação das responsabilidades, alta testabilidade e independência de frameworks.

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
Contém as regras de negócio puras e isoladas.

- **entities/** – Entidades com identidade e comportamentos próprios.
- **errors/** – Exceções que pertencem exclusivamente ao domínio.
- **value-objects/** – Objetos imutáveis com validações embutidas.
- **interfaces/** – Contratos como `UserRepository`, `Hasher`, etc.
- **services/** – Regras de domínio que não se encaixam em uma única entidade.
- **use-cases/** – Casos de uso que orquestram as regras de negócio.

### 🔹 shared/
Código utilitário reutilizável entre camadas.

- **utils/** – Funções auxiliares genéricas.
- **constants/** – Valores fixos globais como limites, enums, etc.

---

### 🤝 Contribuindo
Sinta‑se à vontade para abrir issues ou pull requests. Vamos tornar o aprendizado mais fácil juntos! ✨

