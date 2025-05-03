import { DomainError } from "@/domain/errors/domain-error";

export class InvalidDeckDescriptionError extends DomainError {
  constructor(description: string) {
    super(`The deck description "${description}" is invalid.`);
    this.name = "InvalidDeckDescriptionError";
  }
}
