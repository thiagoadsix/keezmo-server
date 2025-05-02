import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";
import { Controller } from "@/presentation/protocols/controller.protocol";

import {
  DeleteDeckValidator,
  DeleteDeckValidatorRequest,
} from "./delete-deck.validator";

export type DeleteDeckRequest = DeleteDeckValidatorRequest;

export type DeleteDeckResponse = void;

export class DeleteDeckController extends BaseController<
  DeleteDeckRequest,
  DeleteDeckResponse
> {
  constructor(
    useCase: UseCase<DeleteDeckRequest, DeleteDeckResponse>,
    validator: Validator<DeleteDeckRequest> = new DeleteDeckValidator()
  ) {
    super(useCase, validator);
  }
}

// TODO: for now, but in future we will move to main layer where we will have the factory method implementations
export const makeDeleteDeckController = (
  useCase: UseCase<DeleteDeckRequest, DeleteDeckResponse>
): Controller<DeleteDeckRequest, DeleteDeckResponse> => {
  const validator = new DeleteDeckValidator();
  return new DeleteDeckController(useCase, validator);
};
