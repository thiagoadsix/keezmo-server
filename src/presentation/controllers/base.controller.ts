import { HttpRequest, HttpResponse, ok } from "../protocols/http.protocol";
import { Controller } from "../protocols/controller.protocol";

import { ErrorMapper } from "../mappers/error.mapper";

export interface UseCase<Request, Response> {
  execute(request: Request): Promise<Response>;
}

export interface Validator<T> {
  validate(data: unknown): T;
}

export class BaseController<Request, Response>
  implements Controller<Request, Response>
{
  constructor(
    private readonly useCase: UseCase<Request, Response>,
    private readonly validator?: Validator<Request>
  ) {}

  async handle(request: HttpRequest<unknown>): Promise<HttpResponse<Response>> {
    try {
      let validatedData: Request = {} as Request;

      if (this.validator) {
        validatedData = this.validator.validate(request);
      }

      const result = await this.useCase.execute(validatedData);
      return ok<Response>(result);
    } catch (error) {
      return ErrorMapper.toHttpResponse(error) as HttpResponse<Response>;
    }
  }
}
