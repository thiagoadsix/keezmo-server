import { DomainError } from "@/domain/errors/domain-error";

export class CardNotFoundError extends DomainError {
  constructor(cardId: string, deckId: string) {
    super(`Card with ID ${cardId} not found in deck ${deckId}`);
    this.name = "CardNotFoundError";
  }
}
