import { InitializeProgressUseCase } from "@/domain/use-cases/progress/initialize-progress.usecase";

import { progressRepositoryFactory } from "@/main/factories/repositories/dynamodb";

export const initializeProgressUseCaseFactory = () => {
  const progressRepository = progressRepositoryFactory();

  return new InitializeProgressUseCase(progressRepository);
};
