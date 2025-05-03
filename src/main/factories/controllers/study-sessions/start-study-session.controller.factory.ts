import { StartStudySessionController } from "@/presentation/controllers/study-session/start-study-session";

import { startStudySessionUseCaseFactory } from "@/main/factories/use-cases/study-sessions";

export const startStudySessionControllerFactory = () => {
  const useCase = startStudySessionUseCaseFactory();
  return new StartStudySessionController(useCase);
};
