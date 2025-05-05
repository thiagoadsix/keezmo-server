import { EndStudySessionController } from "@/presentation/controllers/study-session/end-study-session";

import { endStudySessionUseCaseFactory } from "@/main/factories/use-cases/study-sessions";

export const endStudySessionControllerFactory = () => {
  const useCase = endStudySessionUseCaseFactory();
  return new EndStudySessionController(useCase);
};
