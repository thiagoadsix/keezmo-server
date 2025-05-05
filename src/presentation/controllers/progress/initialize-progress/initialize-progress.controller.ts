import { Progress } from "@/domain/entities/progress";

import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";

import {
  InitializeProgressValidator,
  InitializeProgressValidatorRequest,
} from "./initialize-progress.validator";

export type InitializeProgressRequest = InitializeProgressValidatorRequest;

export interface InitializeProgressResponse {
  progress: Progress;
  isNew: boolean;
}

export class InitializeProgressController extends BaseController<
  InitializeProgressRequest,
  InitializeProgressResponse
> {
  constructor(
    useCase: UseCase<InitializeProgressRequest, InitializeProgressResponse>,
    validator: Validator<InitializeProgressRequest> = new InitializeProgressValidator()
  ) {
    super(useCase, validator);
  }
}
