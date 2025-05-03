import { describe, expect, it } from "vitest";

import { DomainError } from "@/domain/errors/domain-error";

import { ErrorMapper } from "@/presentation/mappers/error.mapper";
import { HttpStatusCode } from "@/presentation/protocols/http.protocol";
import { ValidationError } from "@/presentation/errors/validation-error";

class CustomDomainError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

describe("ErrorMapper", () => {
  it("should return a server error when an unknown error is passed", () => {
    const error = new Error("Unknown error");

    const result = ErrorMapper.toHttpResponse(error);

    expect(result).toEqual({
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      body: { message: error.message },
    });
  });

  it("should return unprocessable entity when a domain error is passed", () => {
    const error = new CustomDomainError("Domain error");

    const result = ErrorMapper.toHttpResponse(error);

    expect(result).toEqual({
      statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
      body: { message: error.message },
    });
  });

  it("should a string error be converted to an error instance", () => {
    const error = "Domain error";

    const result = ErrorMapper.toHttpResponse(error);

    expect(result).toEqual({
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      body: { message: error },
    });
  });

  it("should return a bad request when a validation error is passed", () => {
    const error = new ValidationError("Validation error");

    const result = ErrorMapper.toHttpResponse(error);

    expect(result).toEqual({
      statusCode: HttpStatusCode.BAD_REQUEST,
      body: { message: error.message, errors: error.errors },
    });
  });
});
