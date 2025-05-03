import { Deck } from "@/domain/entities/deck";

import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";

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
