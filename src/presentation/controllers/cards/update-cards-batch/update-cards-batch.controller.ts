import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";

import {
  UpdateCardsBatchValidator,
  UpdateCardsBatchValidatorRequest,
} from "./update-cards-batch.validator";

export type UpdateCardsBatchRequest = UpdateCardsBatchValidatorRequest;

export type UpdateCardsBatchResponse = {
  id: string;
  question: string;
  answer: string;
}[];

export class UpdateCardsBatchController extends BaseController<
  UpdateCardsBatchRequest,
  UpdateCardsBatchResponse
> {
  constructor(
    useCase: UseCase<UpdateCardsBatchRequest, UpdateCardsBatchResponse>,
    validator: Validator<UpdateCardsBatchRequest> = new UpdateCardsBatchValidator()
  ) {
    super(useCase, validator);
  }
}
