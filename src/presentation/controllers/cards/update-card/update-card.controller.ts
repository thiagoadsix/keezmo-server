import { Card } from "@/domain/entities/card";

import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";
import { Controller } from "@/presentation/protocols/controller.protocol";

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

// TODO: for now, but in future we will move to main layer where we will have the factory method implementations
export const makeUpdateCardController = (
  useCase: UseCase<UpdateCardRequest, UpdateCardResponse>
): Controller<UpdateCardRequest, UpdateCardResponse> => {
  const validator = new UpdateCardValidator();
  return new UpdateCardController(useCase, validator);
};
