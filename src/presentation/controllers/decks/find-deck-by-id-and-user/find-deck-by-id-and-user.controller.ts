import { Deck } from "@/domain/entities/deck";

import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";

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
