import { describe, expect, it } from 'vitest';

import { DomainError } from '@/domain/errors/domain-error';
import { ProgressNotFoundError } from '@/domain/errors/progress/progress-not-found-error';

describe('ProgressNotFoundError', () => {
  it('should set the correct error message and name', () => {
    const cardId = 'card-123';
    const deckId = 'deck-456';

    const error = new ProgressNotFoundError(cardId, deckId);

    expect(error.message).toBe(`Progress not found for card ${cardId} in deck ${deckId}`);
    expect(error.name).toBe('ProgressNotFoundError');
    expect(error).toBeInstanceOf(DomainError);
  });
});
