import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";

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
