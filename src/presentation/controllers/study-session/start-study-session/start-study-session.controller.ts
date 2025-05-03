import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";

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
