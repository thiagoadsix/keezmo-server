import { ZodError, ZodSchema } from "zod";

import { ValidationError } from "@/presentation/errors/validation-error";

export abstract class BaseValidator<T> {
  constructor(private readonly schema: ZodSchema<T>) {}

  validate(data: unknown): T {
    try {
      return this.schema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        throw ValidationError.fromZodError(error);
      }
      throw error;
    }
  }
}
