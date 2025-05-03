import { describe, expect, it } from 'vitest';

import { DomainError } from '@/domain/errors/domain-error';
import { InvalidDifficultyError } from '@/domain/errors/invalid-difficulty-error';

describe('InvalidDifficultyError', () => {
  it('should set the correct error message and name', () => {
    const invalidDifficulty = 'unknown';

    const error = new InvalidDifficultyError(invalidDifficulty);

    expect(error.message).toBe(`The difficulty "${invalidDifficulty}" is invalid.`);
    expect(error.name).toBe('InvalidDifficultyError');
  });

  it('should extend DomainError', () => {
    const error = new InvalidDifficultyError('invalid');

    expect(error).toBeInstanceOf(DomainError);
  });
});
