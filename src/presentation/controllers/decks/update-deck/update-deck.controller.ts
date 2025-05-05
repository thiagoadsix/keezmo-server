import { Deck } from "@/domain/entities/deck";

import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";

import {
  UpdateDeckValidator,
  UpdateDeckValidatorRequest,
} from "./update-deck.validator";

export type UpdateDeckRequest = UpdateDeckValidatorRequest;

export type UpdateDeckResponse = Deck;

export class UpdateDeckController extends BaseController<
  UpdateDeckRequest,
  UpdateDeckResponse
> {
  constructor(
    useCase: UseCase<UpdateDeckRequest, UpdateDeckResponse>,
    validator: Validator<UpdateDeckRequest> = new UpdateDeckValidator()
  ) {
    super(useCase, validator);
  }
}
