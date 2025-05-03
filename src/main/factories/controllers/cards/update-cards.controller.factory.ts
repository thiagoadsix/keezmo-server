import { UpdateCardsController } from "@/presentation/controllers/cards/update-cards/update-cards.controller";

import { updateCardsUseCaseFactory } from "@/main/factories/use-cases/cards";

export const updateCardsControllerFactory = () => {
  const useCase = updateCardsUseCaseFactory();
  return new UpdateCardsController(useCase);
};
