import { DeleteDeckController } from "@/presentation/controllers/decks/delete-deck/delete-deck.controller";

import { deleteDeckUseCaseFactory } from "../../use-cases/decks/delete-deck.use-case.factory";

export const deleteDeckControllerFactory = () => {
  const useCase = deleteDeckUseCaseFactory();
  return new DeleteDeckController(useCase);
};
