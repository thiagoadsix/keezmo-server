import { describe, expect, it } from 'vitest';

import { DeckNotFoundError } from '@/domain/errors/deck/deck-not-found-error';
import { DomainError } from '@/domain/errors/domain-error';

describe('DeckNotFoundError', () => {
  it('should set the correct error message and name', () => {
    const deckId = 'deck-123';
    const userId = 'user-456';

    const error = new DeckNotFoundError(deckId, userId);

    expect(error.message).toBe(`Deck with ID ${deckId} not found for user ${userId}`);
    expect(error.name).toBe('DeckNotFoundError');
    expect(error).toBeInstanceOf(DomainError);
  });
});
