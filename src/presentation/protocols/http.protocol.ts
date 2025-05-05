export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}

export interface CookieOptions {
  value: string;
  options?: {
    maxAge?: number;
    expires?: Date;
    httpOnly?: boolean;
    secure?: boolean;
    domain?: string;
    path?: string;
    sameSite?: boolean | "lax" | "strict" | "none";
    signed?: boolean;
  };
}

export interface HttpResponse<T = unknown> {
  statusCode: HttpStatusCode;
  body: T;
  headers?: Record<string, string>;
  cookies?: Record<string, CookieOptions>;
}

export interface HttpRequest<T = unknown> {
  body?: T;
  params?: Record<string, string>;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  user?: Record<string, unknown>;
}

export const ok = <T>(data: T): HttpResponse<T> => ({
  statusCode: HttpStatusCode.OK,
  body: data,
});

export const created = <T>(data: T): HttpResponse<T> => ({
  statusCode: HttpStatusCode.CREATED,
  body: data,
});

export const noContent = (): HttpResponse => ({
  statusCode: HttpStatusCode.NO_CONTENT,
  body: undefined,
});

export const badRequest = (
  error: Error
): HttpResponse<{ message: string }> => ({
  statusCode: HttpStatusCode.BAD_REQUEST,
  body: { ...error },
});

export const unauthorized = (
  error: Error
): HttpResponse<{ message: string }> => ({
  statusCode: HttpStatusCode.UNAUTHORIZED,
  body: { message: error.message },
});

export const forbidden = (error: Error): HttpResponse<{ message: string }> => ({
  statusCode: HttpStatusCode.FORBIDDEN,
  body: { message: error.message },
});

export const notFound = (error: Error): HttpResponse<{ message: string }> => ({
  statusCode: HttpStatusCode.NOT_FOUND,
  body: { message: error.message },
});

export const conflict = (error: Error): HttpResponse<{ message: string }> => ({
  statusCode: HttpStatusCode.CONFLICT,
  body: { message: error.message },
});

export const unprocessableEntity = (
  error: Error
): HttpResponse<{ message: string }> => ({
  statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
  body: { message: error.message },
});

export const serverError = (
  error: Error
): HttpResponse<{ message: string }> => ({
  statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
  body: { message: error.message },
});

export const badGateway = (
  error: Error
): HttpResponse<{ message: string }> => ({
  statusCode: HttpStatusCode.BAD_GATEWAY,
  body: { message: error.message },
});
