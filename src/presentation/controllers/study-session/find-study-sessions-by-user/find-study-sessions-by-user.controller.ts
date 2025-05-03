import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";
import { Controller } from "@/presentation/protocols/controller.protocol";
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

// TODO: for now, but in future we will move to main layer where we will have the factory method implementations
export const makeFindStudySessionsByUserController = (
  useCase: UseCase<
    FindStudySessionsByUserRequest,
    FindStudySessionsByUserResponse
  >
): Controller<
  FindStudySessionsByUserRequest,
  FindStudySessionsByUserResponse
> => {
  const validator = new FindStudySessionsByUserValidator();
  return new FindStudySessionsByUserController(useCase, validator);
};
