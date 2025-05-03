import { StartStudySessionUseCase } from "@/domain/use-cases/study-session/start-study-session.usecase";

import { studySessionRepositoryFactory } from "@/main/factories/repositories/dynamodb";

export const startStudySessionUseCaseFactory = () => {
  const studySessionRepository = studySessionRepositoryFactory();

  return new StartStudySessionUseCase(studySessionRepository);
};
