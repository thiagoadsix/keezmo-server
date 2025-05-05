import { InitializeProgressController } from "@/presentation/controllers/progress/initialize-progress";

import { initializeProgressUseCaseFactory } from "@/main/factories/use-cases/progress";

export const initializeProgressControllerFactory = () => {
  const useCase = initializeProgressUseCaseFactory();
  return new InitializeProgressController(useCase);
};
