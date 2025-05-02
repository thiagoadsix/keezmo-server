import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";
import { Controller } from "@/presentation/protocols/controller.protocol";

import { Card } from "@/domain/entities/card";

import {
  FindCardsByDeckIdValidator,
  FindCardsByDeckIdValidatorRequest,
} from "./find-cards-by-deck-id.validator";

export type FindCardsByDeckIdRequest = FindCardsByDeckIdValidatorRequest;

export type FindCardsByDeckIdResponse = Card[];

export class FindCardsByDeckIdController extends BaseController<
  FindCardsByDeckIdRequest,
  FindCardsByDeckIdResponse
> {
  constructor(
    useCase: UseCase<FindCardsByDeckIdRequest, FindCardsByDeckIdResponse>,
    validator: Validator<FindCardsByDeckIdRequest> = new FindCardsByDeckIdValidator()
  ) {
    super(useCase, validator);
  }
}

// TODO: for now, but in future we will move to main layer where we will have the factory method implementations
export const makeFindCardsByDeckIdController = (
  useCase: UseCase<FindCardsByDeckIdRequest, FindCardsByDeckIdResponse>
): Controller<FindCardsByDeckIdRequest, FindCardsByDeckIdResponse> => {
  const validator = new FindCardsByDeckIdValidator();
  return new FindCardsByDeckIdController(useCase, validator);
};
