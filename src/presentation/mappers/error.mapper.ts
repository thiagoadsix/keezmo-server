import { DomainError } from "@/domain/errors/domain-error";

import {
  HttpResponse,
  badRequest,
  serverError,
  unprocessableEntity,
} from "@/presentation/protocols/http.protocol";
import { ValidationError } from "@/presentation/errors/validation-error";

export class ErrorMapper {
  static toHttpResponse(error: Error | unknown): HttpResponse {
    if (error instanceof ValidationError) {
      return badRequest({
        message: error.message,
        errors: error.errors,
      } as unknown as Error);
    }

    if (error instanceof DomainError) {
      return unprocessableEntity(error);
    }

    // Fallback for unexpected errors
    const serverException =
      error instanceof Error ? error : new Error(String(error));

    console.error("[Server Error]", serverException);
    return serverError(serverException);
  }
}
