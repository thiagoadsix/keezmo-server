import { CreateDeckController } from "@/presentation/controllers/decks/create-deck/create-deck.controller";

import { createDeckUseCaseFactory } from "@/main/factories/use-cases/decks/create-deck.use-case.factory";

export const createDeckControllerFactory = () => {
  const useCase = createDeckUseCaseFactory();
  return new CreateDeckController(useCase);
};
