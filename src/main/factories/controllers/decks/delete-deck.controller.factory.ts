import { DeleteDeckController } from "@/presentation/controllers/decks/delete-deck/delete-deck.controller";

import { deleteDeckUseCaseFactory } from "@/main/factories/use-cases/decks";

export const deleteDeckControllerFactory = () => {
  const useCase = deleteDeckUseCaseFactory();
  return new DeleteDeckController(useCase);
};
