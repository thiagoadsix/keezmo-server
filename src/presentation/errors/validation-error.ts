import { ZodError } from "zod";

export class ValidationError extends Error {
  constructor(message: string, public readonly errors?: ZodError["errors"]) {
    super(message);
    this.name = "ValidationError";
  }

  static fromZodError(error: ZodError): ValidationError {
    const message = "Validation failed";
    return new ValidationError(message, error.errors);
  }
}
