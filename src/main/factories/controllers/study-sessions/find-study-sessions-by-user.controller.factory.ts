import { FindStudySessionsByUserController } from "@/presentation/controllers/study-session/find-study-sessions-by-user";

import { findStudySessionsByUserUseCaseFactory } from "@/main/factories/use-cases/study-sessions";

export const findStudySessionsByUserControllerFactory = () => {
  const useCase = findStudySessionsByUserUseCaseFactory();
  return new FindStudySessionsByUserController(useCase);
};
