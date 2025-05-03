import { describe, expect, it } from 'vitest';

import { InvalidDeckTitleError } from '@/domain/errors/deck/invalid-deck-title-error';

describe('InvalidDeckTitleError', () => {
  it('should set the correct error message and name', () => {
    const invalidTitle = '';

    const error = new InvalidDeckTitleError(invalidTitle);

    expect(error.message).toBe(`The deck title "${invalidTitle}" is invalid.`);
    expect(error.name).toBe('InvalidDeckTitleError');
  });
});
