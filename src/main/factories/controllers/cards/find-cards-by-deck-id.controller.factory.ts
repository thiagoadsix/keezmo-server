import { FindCardsByDeckIdController } from "@/presentation/controllers/cards/find-cards-by-deck-id/find-cards-by-deck-id.controller";

import { findCardsByDeckIdUseCaseFactory } from "@/main/factories/use-cases/cards";

export const findCardsByDeckIdControllerFactory = () => {
  const useCase = findCardsByDeckIdUseCaseFactory();
  return new FindCardsByDeckIdController(useCase);
};
