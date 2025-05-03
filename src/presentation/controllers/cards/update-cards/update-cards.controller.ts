import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";

import {
  UpdateCardsValidator,
  UpdateCardsValidatorRequest,
} from "./update-cards.validator";

export type UpdateCardsRequest = UpdateCardsValidatorRequest;

export type UpdateCardsResponse = {
  id: string;
  question: string;
  answer: string;
}[];

export class UpdateCardsController extends BaseController<
  UpdateCardsRequest,
  UpdateCardsResponse
> {
  constructor(
    useCase: UseCase<UpdateCardsRequest, UpdateCardsResponse>,
    validator: Validator<UpdateCardsRequest> = new UpdateCardsValidator()
  ) {
    super(useCase, validator);
  }
}
