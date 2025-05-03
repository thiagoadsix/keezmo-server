import { CreateCardsBatchController } from "@/presentation/controllers/cards/create-cards-batch/create-cards-batch.controller";

import { createCardsBatchUseCaseFactory } from "@/main/factories/use-cases/cards";

export const createCardsBatchControllerFactory = () => {
  const useCase = createCardsBatchUseCaseFactory();
  return new CreateCardsBatchController(useCase);
};
