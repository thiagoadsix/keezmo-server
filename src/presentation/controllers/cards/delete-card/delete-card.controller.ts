import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";
import {
  HttpResponse,
  noContent,
} from "@/presentation/protocols/http.protocol";
import { Controller } from "@/presentation/protocols/controller.protocol";

import {
  DeleteCardValidator,
  DeleteCardValidatorRequest,
} from "./delete-card.validator";

export type DeleteCardRequest = DeleteCardValidatorRequest;

export type DeleteCardResponse = void;

export class DeleteCardController extends BaseController<
  DeleteCardRequest,
  DeleteCardResponse
> {
  constructor(
    useCase: UseCase<DeleteCardRequest, DeleteCardResponse>,
    validator: Validator<DeleteCardRequest> = new DeleteCardValidator()
  ) {
    super(useCase, validator);
  }

  protected override createSuccessResponse(): HttpResponse<DeleteCardResponse> {
    return noContent() as HttpResponse<DeleteCardResponse>;
  }
}

// TODO: for now, but in future we will move to main layer where we will have the factory method implementations
export const makeDeleteCardController = (
  useCase: UseCase<DeleteCardRequest, DeleteCardResponse>
): Controller<DeleteCardRequest, DeleteCardResponse> => {
  const validator = new DeleteCardValidator();
  return new DeleteCardController(useCase, validator);
};
