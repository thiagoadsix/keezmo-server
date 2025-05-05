import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";
import { HttpResponse, created } from "@/presentation/protocols/http.protocol";

import {
  CreateCardsBatchValidator,
  CreateCardsBatchValidatorRequest,
} from "./create-cards-batch.validator";

export type CreateCardsBatchRequest = CreateCardsBatchValidatorRequest;

export type CreateCardsBatchResponse = void;

export class CreateCardsBatchController extends BaseController<
  CreateCardsBatchRequest,
  CreateCardsBatchResponse
> {
  constructor(
    useCase: UseCase<CreateCardsBatchRequest, CreateCardsBatchResponse>,
    validator: Validator<CreateCardsBatchRequest> = new CreateCardsBatchValidator()
  ) {
    super(useCase, validator);
  }

  protected override createSuccessResponse(
    data: CreateCardsBatchResponse
  ): HttpResponse<CreateCardsBatchResponse> {
    return created<CreateCardsBatchResponse>(data);
  }
}
