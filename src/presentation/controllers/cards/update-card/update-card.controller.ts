import { Card } from "@/domain/entities/card";

import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";

import {
  UpdateCardValidator,
  UpdateCardValidatorRequest,
} from "./update-card.validator";

export type UpdateCardRequest = UpdateCardValidatorRequest;

export type UpdateCardResponse = Card;

export class UpdateCardController extends BaseController<
  UpdateCardRequest,
  UpdateCardResponse
> {
  constructor(
    useCase: UseCase<UpdateCardRequest, UpdateCardResponse>,
    validator: Validator<UpdateCardRequest> = new UpdateCardValidator()
  ) {
    super(useCase, validator);
  }
}
