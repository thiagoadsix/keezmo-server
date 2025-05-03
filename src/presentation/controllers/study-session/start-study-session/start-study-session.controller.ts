import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";
import { Controller } from "@/presentation/protocols/controller.protocol";

import {
  StartStudySessionValidator,
  StartStudySessionValidatorRequest,
} from "./start-study-session.validator";

export type StartStudySessionRequest = StartStudySessionValidatorRequest;

export interface StartStudySessionResponse {
  sessionId: string;
}

export class StartStudySessionController extends BaseController<
  StartStudySessionRequest,
  StartStudySessionResponse
> {
  constructor(
    useCase: UseCase<StartStudySessionRequest, StartStudySessionResponse>,
    validator: Validator<StartStudySessionRequest> = new StartStudySessionValidator()
  ) {
    super(useCase, validator);
  }
}

// TODO: for now, but in future we will move to main layer where we will have the factory method implementations
export const makeStartStudySessionController = (
  useCase: UseCase<StartStudySessionRequest, StartStudySessionResponse>
): Controller<StartStudySessionRequest, StartStudySessionResponse> => {
  const validator = new StartStudySessionValidator();
  return new StartStudySessionController(useCase, validator);
};
