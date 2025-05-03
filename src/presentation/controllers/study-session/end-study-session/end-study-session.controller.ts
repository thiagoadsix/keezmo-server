import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";
import { Controller } from "@/presentation/protocols/controller.protocol";

import {
  EndStudySessionValidator,
  EndStudySessionValidatorRequest,
} from "./end-study-session.validator";

export type EndStudySessionRequest = EndStudySessionValidatorRequest;

export interface EndStudySessionResponse {
  durationSeconds: number;
}

export class EndStudySessionController extends BaseController<
  EndStudySessionRequest,
  EndStudySessionResponse
> {
  constructor(
    useCase: UseCase<EndStudySessionRequest, EndStudySessionResponse>,
    validator: Validator<EndStudySessionRequest> = new EndStudySessionValidator()
  ) {
    super(useCase, validator);
  }
}

// TODO: for now, but in future we will move to main layer where we will have the factory method implementations
export const makeEndStudySessionController = (
  useCase: UseCase<EndStudySessionRequest, EndStudySessionResponse>
): Controller<EndStudySessionRequest, EndStudySessionResponse> => {
  const validator = new EndStudySessionValidator();
  return new EndStudySessionController(useCase, validator);
};
