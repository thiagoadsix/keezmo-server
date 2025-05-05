import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";

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
