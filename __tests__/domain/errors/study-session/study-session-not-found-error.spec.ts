import { describe, expect, it } from 'vitest';

import { DomainError } from '@/domain/errors/domain-error';
import { StudySessionNotFoundError } from '@/domain/errors/study-session/study-session-not-found-error';

describe('StudySessionNotFoundError', () => {
  it('should set the correct error message and name', () => {
    const sessionId = 'session-123';

    const error = new StudySessionNotFoundError(sessionId);

    expect(error.message).toBe(`Study session with ID ${sessionId} not found`);
    expect(error.name).toBe('StudySessionNotFoundError');
    expect(error).toBeInstanceOf(DomainError);
  });
});
