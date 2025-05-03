import { EndStudySessionUseCase } from "@/domain/use-cases/study-session/end-study-session.usecase";

import { studySessionRepositoryFactory } from "@/main/factories/repositories/dynamodb";

export const endStudySessionUseCaseFactory = () => {
  const studySessionRepository = studySessionRepositoryFactory();

  return new EndStudySessionUseCase(studySessionRepository);
};
