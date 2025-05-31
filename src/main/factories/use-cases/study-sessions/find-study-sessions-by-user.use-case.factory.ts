import { FindStudySessionsByUserUseCase } from "@/domain/use-cases/study-session/find-study-sessions-by-user.usecase";

import { cardRepositoryFactory, deckRepositoryFactory, studySessionRepositoryFactory } from "@/main/factories/repositories/dynamodb";

export const findStudySessionsByUserUseCaseFactory = () => {
  const studySessionRepository = studySessionRepositoryFactory();
  const deckRepository = deckRepositoryFactory();
  const cardRepository = cardRepositoryFactory();

  return new FindStudySessionsByUserUseCase(studySessionRepository, deckRepository, cardRepository);
};
