import { describe, expect, it } from 'vitest';

import { InvalidDeckDescriptionError } from '@/domain/errors/deck/invalid-deck-description-error';

describe('InvalidDeckDescriptionError', () => {
  it('should set the correct error message and name', () => {
    const invalidDescription = 'null';

    const error = new InvalidDeckDescriptionError(invalidDescription);

    expect(error.message).toBe(`The deck description "${invalidDescription}" is invalid.`);
    expect(error.name).toBe('InvalidDeckDescriptionError');
  });
});
