import { UpdateCardController } from "@/presentation/controllers/cards/update-card/update-card.controller";

import { updateCardUseCaseFactory } from "@/main/factories/use-cases/cards";

export const updateCardControllerFactory = () => {
  const useCase = updateCardUseCaseFactory();
  return new UpdateCardController(useCase);
};
