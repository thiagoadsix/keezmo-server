import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";
import {
  HttpResponse,
  noContent,
} from "@/presentation/protocols/http.protocol";

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
