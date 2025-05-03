import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { BaseValidator } from "@/presentation/controllers/base.validator";
import { ValidationError } from "@/presentation/errors/validation-error";

class TestValidator extends BaseValidator<unknown> {
  constructor() {
    super(
      z.object({
        name: z.string(),
        age: z.number(),
      })
    );
  }
}

describe("BaseValidator", () => {
  let validator: BaseValidator<unknown>;

  beforeEach(() => {
    validator = new TestValidator();
  });

  it("should be a class", () => {
    expect(validator).toBeInstanceOf(BaseValidator);
  });

  it("should validate a valid request", () => {
    const request = {
      name: "John Doe",
      age: 30,
    };

    const result = validator.validate(request);

    expect(result).toEqual(request);
  });

  it("should throw a ValidationError when the request is invalid", () => {
    const request = {
      name: "John Doe",
      age: "30",
    };

    expect(() => validator.validate(request)).toThrow(ValidationError);
  });

  it("should rethrow non-ZodError exceptions", () => {
    const mockSchema = {
      parse: vi.fn().mockImplementation(() => {
        throw new Error("Non-ZodError");
      }),
    };

    // @ts-expect-error mockSchema doesn't implement the full ZodSchema interface
    const errorValidator = new BaseValidator(mockSchema);

    expect(() => errorValidator.validate({})).toThrow("Non-ZodError");
    expect(mockSchema.parse).toHaveBeenCalledTimes(1);
  });
});
