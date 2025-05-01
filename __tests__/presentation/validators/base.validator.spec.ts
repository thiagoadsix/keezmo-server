import { beforeEach, describe, expect, it } from "vitest";
import { z } from "zod";

import { BaseValidator } from "@/presentation/validators/base.validator";
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

  it("should throw a error that is not a ValidationError", () => {
    const request = {
      name: "John Doe",
      age: "30",
    };

    expect(() => validator.validate(request)).toThrow(Error);
  });
});
