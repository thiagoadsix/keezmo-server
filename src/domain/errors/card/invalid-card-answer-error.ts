import { DomainError } from '../domain-error';

export class InvalidCardAnswerError extends DomainError {
  constructor(answer: string) {
    super(`The card answer "${answer}" is invalid.`);
    this.name = 'InvalidCardAnswerError';
  }
}
