import { DomainError } from '../domain-error';

export class StudySessionValidationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'StudySessionValidationError';
  }
}
