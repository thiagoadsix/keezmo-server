import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";
import { HttpResponse, created } from "@/presentation/protocols/http.protocol";
import { Controller } from "@/presentation/protocols/controller.protocol";

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

// TODO: for now, but in future we will move to main layer where we will have the factory method implementations
export const makeCreateCardsBatchController = (
  useCase: UseCase<CreateCardsBatchRequest, CreateCardsBatchResponse>
): Controller<CreateCardsBatchRequest, CreateCardsBatchResponse> => {
  const validator = new CreateCardsBatchValidator();
  return new CreateCardsBatchController(useCase, validator);
};
