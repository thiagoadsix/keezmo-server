import { DomainError } from '../domain-error';

export class ProgressNotFoundError extends DomainError {
  constructor(cardId: string, deckId: string) {
    super(`Progress not found for card ${cardId} in deck ${deckId}`);
    this.name = 'ProgressNotFoundError';
  }
}
