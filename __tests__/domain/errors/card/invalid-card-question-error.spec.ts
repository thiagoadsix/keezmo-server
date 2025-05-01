import { describe, expect, it } from 'vitest';

import { DomainError } from '@/domain/errors/domain-error';
import { InvalidCardQuestionError } from '@/domain/errors/card/invalid-card-question-error';

describe('InvalidCardQuestionError', () => {
  it('should extend DomainError', () => {
    const error = new InvalidCardQuestionError('test');
    expect(error).toBeInstanceOf(DomainError);
  });

  it('should set the correct error message and name', () => {
    const invalidQuestion = '';
    const error = new InvalidCardQuestionError(invalidQuestion);

    expect(error.message).toBe(`The card question "${invalidQuestion}" is invalid.`);
    expect(error.name).toBe('InvalidCardQuestionError');
  });
});
