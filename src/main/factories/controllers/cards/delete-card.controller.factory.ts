import { DeleteCardController } from "@/presentation/controllers/cards/delete-card/delete-card.controller";

import { deleteCardUseCaseFactory } from "@/main/factories/use-cases/cards";

export const deleteCardControllerFactory = () => {
  const useCase = deleteCardUseCaseFactory();
  return new DeleteCardController(useCase);
};
