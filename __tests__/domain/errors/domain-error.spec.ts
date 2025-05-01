import { describe, expect, it } from 'vitest';

import { DomainError } from '@/domain/errors/domain-error';
import { InvalidDeckTitleError } from '@/domain/errors/deck/invalid-deck-title-error';

describe('Domain Errors', () => {
  describe('DomainError', () => {
    it('should be an abstract class extending Error', () => {
      const error = new InvalidDeckTitleError('test');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(DomainError);
    });
  });
});
