import { Card } from "@/domain/entities/card";
import { Progress } from "@/domain/entities/progress";

import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";

import {
  CreateCardValidator,
  CreateCardValidatorRequest,
} from "./create-card.validator";

export type CreateCardRequest = CreateCardValidatorRequest;

export interface CreateCardResponse {
  card: Card;
  progress: Progress;
}

export class CreateCardController extends BaseController<
  CreateCardRequest,
  CreateCardResponse
> {
  constructor(
    useCase: UseCase<CreateCardRequest, CreateCardResponse>,
    validator: Validator<CreateCardRequest> = new CreateCardValidator()
  ) {
    super(useCase, validator);
  }
}
