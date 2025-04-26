# 🧱 Keezmo

### 📚 Documentação Técnica da Estrutura de Diretórios

A estrutura do Keezmo segue a metodologia Clean Architecture, proporcionando clareza na separação das responsabilidades, testabilidade eficiente e independência dos frameworks utilizados. A seguir, detalhamos cada parte da estrutura técnica com definições, propósitos e exemplos.


```txt
src/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── interfaces/
│   ├── services/
│   └── use-cases/
├── shared/
    ├── utils/
    └── constants/

__tests__/
├── unit/
├── integration/
└── e2e/
```

## 🔹 domain/
Contém as regras de negócio puras e isoladas.

- entities/: Entidades com identidade e comportamentos próprios.
- errors/: Erros para representar exceções a nível de domínio.
- value-objects/: Objetos imutáveis com validações.
- interfaces/: Contratos como UserRepository, Hasher, etc.
- services/: Lógica de negócio que não pertence a uma entidade específica.
- use-cases/: Casos de uso da aplicação orquestrando regras de negócio.

## 🔹 shared/
Código utilitário reutilizável entre camadas.

- utils/: Helpers genéricos.
- constants/: Valores fixos globais como limites, enums, etc.

## Stack

- Node.js
- TypeScript
- AWS
- Serverless
- CDK
