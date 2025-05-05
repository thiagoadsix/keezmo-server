import { UpdateCardsBatchController } from "@/presentation/controllers/cards/update-cards-batch";

import { updateCardsBatchUseCaseFactory } from "@/main/factories/use-cases/cards";

export const updateCardsBatchControllerFactory = () => {
  const useCase = updateCardsBatchUseCaseFactory();
  return new UpdateCardsBatchController(useCase);
};
