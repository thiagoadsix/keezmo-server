import { beforeEach, describe, expect, it } from "vitest";

import { ValidationError } from "@/presentation/errors/validation-error";

import { FindStudySessionsByUserValidator } from "@/presentation/controllers/study-session/find-study-sessions-by-user";

describe("FindStudySessionsByUserValidator", () => {
  let validator: FindStudySessionsByUserValidator;

  beforeEach(() => {
    validator = new FindStudySessionsByUserValidator();
  });

  it("should validate a valid find study sessions by user request", () => {
    const validRequest = {
      user: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual({
      userId: validRequest.user.id,
    });
  });

  it("should throw ValidationError if userId is not a valid UUID", () => {
    const invalidRequest = {
      user: {
        id: 1,
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError when params are missing", () => {
    const invalidRequest = {};

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError when userId is missing", () => {
    const invalidRequest = {
      user: {},
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });
});
