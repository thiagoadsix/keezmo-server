import { beforeEach, describe, expect, it } from "vitest";

import { ValidationError } from "@/presentation/errors/validation-error";

import { EndStudySessionValidator } from "@/presentation/controllers/study-session/end-study-session";

describe("EndStudySessionValidator", () => {
  let validator: EndStudySessionValidator;

  beforeEach(() => {
    validator = new EndStudySessionValidator();
  });

  it("should validate a valid end study session request with totalQuestions", () => {
    const validRequest = {
      params: {
        sessionId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      body: {
        totalQuestions: 10,
      },
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual({
      sessionId: validRequest.params.sessionId,
      totalQuestions: validRequest.body.totalQuestions,
    });
  });

  it("should validate a valid end study session request without body", () => {
    const validRequest = {
      params: {
        sessionId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual({
      sessionId: validRequest.params.sessionId,
    });
  });

  it("should validate a valid end study session request with empty body", () => {
    const validRequest = {
      params: {
        sessionId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      body: {},
    };

    const result = validator.validate(validRequest);
    expect(result).toEqual({
      sessionId: validRequest.params.sessionId,
    });
  });

  it("should throw ValidationError if sessionId is not a valid UUID", () => {
    const invalidRequest = {
      params: {
        sessionId: "invalid-uuid",
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if totalQuestions is not a positive integer", () => {
    const invalidRequest = {
      params: {
        sessionId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      body: {
        totalQuestions: -5,
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError if totalQuestions is not an integer", () => {
    const invalidRequest = {
      params: {
        sessionId: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      body: {
        totalQuestions: 3.5,
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError when params are missing", () => {
    const invalidRequest = {
      body: {
        totalQuestions: 10,
      },
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });

  it("should throw ValidationError when sessionId is missing", () => {
    const invalidRequest = {
      params: {},
    };

    expect(() => validator.validate(invalidRequest)).toThrow(ValidationError);
  });
});
