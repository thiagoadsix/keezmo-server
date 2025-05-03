import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";
import { StudySession } from "@/domain/entities/study-session";

import {
  FindStudySessionsByUserValidator,
  FindStudySessionsByUserValidatorRequest,
} from "./find-study-sessions-by-user.validator";

export type FindStudySessionsByUserRequest =
  FindStudySessionsByUserValidatorRequest;

export type FindStudySessionsByUserResponse = StudySession[];

export class FindStudySessionsByUserController extends BaseController<
  FindStudySessionsByUserRequest,
  FindStudySessionsByUserResponse
> {
  constructor(
    useCase: UseCase<
      FindStudySessionsByUserRequest,
      FindStudySessionsByUserResponse
    >,
    validator: Validator<FindStudySessionsByUserRequest> = new FindStudySessionsByUserValidator()
  ) {
    super(useCase, validator);
  }
}
