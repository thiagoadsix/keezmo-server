import { Card } from "@/domain/entities/card";
import { Progress } from "@/domain/entities/progress";

import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";
import { Controller } from "@/presentation/protocols/controller.protocol";

import {
  FindDueCardsValidator,
  FindDueCardsValidatorRequest,
} from "./find-due-cards.validator";

export type FindDueCardsRequest = FindDueCardsValidatorRequest;

export interface FindDueCardsResponse {
  card: Card;
  progress: Progress;
}

export class FindDueCardsController extends BaseController<
  FindDueCardsRequest,
  FindDueCardsResponse[]
> {
  constructor(
    useCase: UseCase<FindDueCardsRequest, FindDueCardsResponse[]>,
    validator: Validator<FindDueCardsRequest> = new FindDueCardsValidator()
  ) {
    super(useCase, validator);
  }
}

// TODO: for now, but in future we will move to main layer where we will have the factory method implementations
export const makeFindDueCardsController = (
  useCase: UseCase<FindDueCardsRequest, FindDueCardsResponse[]>
): Controller<FindDueCardsRequest, FindDueCardsResponse[]> => {
  const validator = new FindDueCardsValidator();
  return new FindDueCardsController(useCase, validator);
};
