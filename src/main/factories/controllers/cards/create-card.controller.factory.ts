import { CreateCardController } from "@/presentation/controllers/cards/create-card/create-card.controller";

import { createCardUseCaseFactory } from "@/main/factories/use-cases/cards";

export const createCardControllerFactory = () => {
  const useCase = createCardUseCaseFactory();
  return new CreateCardController(useCase);
};
