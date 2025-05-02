import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";
import { Controller } from "@/presentation/protocols/controller.protocol";
import { Deck } from "@/domain/entities/deck";

import {
  FindDeckByIdAndUserValidator,
  FindDeckByIdAndUserValidatorRequest,
} from "./find-deck-by-id-and-user.validator";

export type FindDeckByIdAndUserRequest = FindDeckByIdAndUserValidatorRequest;

export type FindDeckByIdAndUserResponse = Deck;

export class FindDeckByIdAndUserController extends BaseController<
  FindDeckByIdAndUserRequest,
  FindDeckByIdAndUserResponse
> {
  constructor(
    useCase: UseCase<FindDeckByIdAndUserRequest, FindDeckByIdAndUserResponse>,
    validator: Validator<FindDeckByIdAndUserRequest> = new FindDeckByIdAndUserValidator()
  ) {
    super(useCase, validator);
  }
}

// TODO: for now, but in future we will move to main layer where we will have the factory method implementations
export const makeFindDeckByIdAndUserController = (
  useCase: UseCase<FindDeckByIdAndUserRequest, FindDeckByIdAndUserResponse>
): Controller<FindDeckByIdAndUserRequest, FindDeckByIdAndUserResponse> => {
  const validator = new FindDeckByIdAndUserValidator();
  return new FindDeckByIdAndUserController(useCase, validator);
};
