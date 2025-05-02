import { DomainError } from "@/domain/errors/domain-error";

export class StudySessionValidationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = "StudySessionValidationError";
  }
}
