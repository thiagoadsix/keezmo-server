import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";
import { Controller } from "@/presentation/protocols/controller.protocol";
import { Deck } from "@/domain/entities/deck";

import {
  FindDecksByUserValidator,
  FindDecksByUserValidatorRequest,
} from "./find-decks-by-user.validator";

export type FindDecksByUserRequest = FindDecksByUserValidatorRequest;

export type FindDecksByUserResponse = Deck[];

export class FindDecksByUserController extends BaseController<
  FindDecksByUserRequest,
  FindDecksByUserResponse
> {
  constructor(
    useCase: UseCase<FindDecksByUserRequest, FindDecksByUserResponse>,
    validator: Validator<FindDecksByUserRequest> = new FindDecksByUserValidator()
  ) {
    super(useCase, validator);
  }
}

// TODO: for now, but in future we will move to main layer where we will have the factory method implementations
export const makeFindDecksByUserController = (
  useCase: UseCase<FindDecksByUserRequest, FindDecksByUserResponse>
): Controller<FindDecksByUserRequest, FindDecksByUserResponse> => {
  const validator = new FindDecksByUserValidator();
  return new FindDecksByUserController(useCase, validator);
};
