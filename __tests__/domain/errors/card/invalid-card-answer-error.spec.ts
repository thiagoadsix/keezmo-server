import { describe, expect, it } from 'vitest';

import { DomainError } from '@/domain/errors/domain-error';
import { InvalidCardAnswerError } from '@/domain/errors/card/invalid-card-answer-error';

describe('InvalidCardAnswerError', () => {
  it('should extend DomainError', () => {
    const error = new InvalidCardAnswerError('test');
    expect(error).toBeInstanceOf(DomainError);
  });

  it('should set the correct error message and name', () => {
    const invalidAnswer = '';
    const error = new InvalidCardAnswerError(invalidAnswer);

    expect(error.message).toBe(`The card answer "${invalidAnswer}" is invalid.`);
    expect(error.name).toBe('InvalidCardAnswerError');
  });
});
