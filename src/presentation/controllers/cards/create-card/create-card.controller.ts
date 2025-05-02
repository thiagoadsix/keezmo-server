import { Card } from "@/domain/entities/card";
import { Progress } from "@/domain/entities/progress";

import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";
import { Controller } from "@/presentation/protocols/controller.protocol";

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

// TODO: for now, but in future we will move to main layer where we will have the factory method implementations
export const makeCreateCardController = (
  useCase: UseCase<CreateCardRequest, CreateCardResponse>
): Controller<CreateCardRequest, CreateCardResponse> => {
  const validator = new CreateCardValidator();
  return new CreateCardController(useCase, validator);
};
