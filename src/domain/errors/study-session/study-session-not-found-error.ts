import { DomainError } from '../domain-error';

export class StudySessionNotFoundError extends DomainError {
  constructor(sessionId: string) {
    super(`Study session with ID ${sessionId} not found`);
    this.name = 'StudySessionNotFoundError';
  }
}
