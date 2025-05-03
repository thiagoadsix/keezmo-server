import { Card } from "@/domain/entities/card";
import { Progress } from "@/domain/entities/progress";

import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";

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
