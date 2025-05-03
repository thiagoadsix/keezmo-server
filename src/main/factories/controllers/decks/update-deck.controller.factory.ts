import { UpdateDeckController } from "@/presentation/controllers/decks/update-deck/update-deck.controller";

import { updateDeckUseCaseFactory } from "@/main/factories/use-cases/decks";

export const updateDeckControllerFactory = () => {
  const useCase = updateDeckUseCaseFactory();
  return new UpdateDeckController(useCase);
};
