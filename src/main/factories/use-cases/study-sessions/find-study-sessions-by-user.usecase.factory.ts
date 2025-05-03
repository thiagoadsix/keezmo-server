import { FindStudySessionsByUserUseCase } from "@/domain/use-cases/study-session/find-study-sessions-by-user.usecase";

import { studySessionRepositoryFactory } from "@/main/factories/repositories/dynamodb";

export const findStudySessionsByUserUseCaseFactory = () => {
  const studySessionRepository = studySessionRepositoryFactory();

  return new FindStudySessionsByUserUseCase(studySessionRepository);
};
