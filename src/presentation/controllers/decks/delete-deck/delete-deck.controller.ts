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
  DeleteDeckValidator,
  DeleteDeckValidatorRequest,
} from "./delete-deck.validator";

export type DeleteDeckRequest = DeleteDeckValidatorRequest;

export type DeleteDeckResponse = void;

export class DeleteDeckController extends BaseController<
  DeleteDeckRequest,
  DeleteDeckResponse
> {
  constructor(
    useCase: UseCase<DeleteDeckRequest, DeleteDeckResponse>,
    validator: Validator<DeleteDeckRequest> = new DeleteDeckValidator()
  ) {
    super(useCase, validator);
  }

  protected override createSuccessResponse(): HttpResponse<DeleteDeckResponse> {
    return noContent() as HttpResponse<DeleteDeckResponse>;
  }
}
