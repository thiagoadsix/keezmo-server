import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";

import {
  CreateDeckValidator,
  CreateDeckValidatorRequest,
} from "./create-deck.validator";

export type CreateDeckRequest = CreateDeckValidatorRequest;

export type CreateDeckResponse = void;

export class CreateDeckController extends BaseController<
  CreateDeckRequest,
  CreateDeckResponse
> {
  constructor(
    useCase: UseCase<CreateDeckRequest, CreateDeckResponse>,
    validator: Validator<CreateDeckRequest> = new CreateDeckValidator()
  ) {
    super(useCase, validator);
  }
}
