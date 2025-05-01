import { HttpRequest, HttpResponse } from './http.protocol';

export interface Controller<Request = unknown, Response = unknown> {
  handle(request: HttpRequest<Request>): Promise<HttpResponse<Response>>;
}
