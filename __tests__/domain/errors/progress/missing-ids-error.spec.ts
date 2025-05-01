import { describe, expect, it } from 'vitest';

import { DomainError } from '@/domain/errors/domain-error';
import { MissingProgressIdsError } from '@/domain/errors/progress/missing-ids-error';

describe('MissingProgressIdsError', () => {
  it('should set the correct error message and name', () => {
    const error = new MissingProgressIdsError();

    expect(error.message).toBe('cardId e deckId são obrigatórios para o progresso');
    expect(error.name).toBe('MissingProgressIdsError');
  });

  it('should extend DomainError', () => {
    const error = new MissingProgressIdsError();

    expect(error).toBeInstanceOf(DomainError);
  });
});
