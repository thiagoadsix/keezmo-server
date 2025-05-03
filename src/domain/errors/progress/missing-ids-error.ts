import { DomainError } from "@/domain/errors/domain-error";

export class MissingProgressIdsError extends DomainError {
  constructor() {
    super("cardId e deckId são obrigatórios para o progresso");
    this.name = "MissingProgressIdsError";
  }
}
