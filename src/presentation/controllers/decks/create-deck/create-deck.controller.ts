import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";
import {
  CreateDeckValidator,
  CreateDeckValidatorRequest,
} from "./create-deck.validator";
import { Controller } from "@/presentation/protocols/controller.protocol";

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

// TODO: for now, but in future we will move to main layer where we will have the factory method implementations
export const makeCreateDeckController = (
  useCase: UseCase<CreateDeckRequest, CreateDeckResponse>
): Controller<CreateDeckRequest, CreateDeckResponse> => {
  const validator = new CreateDeckValidator();
  return new CreateDeckController(useCase, validator);
};
