import { FindDeckByIdAndUserController } from "@/presentation/controllers/decks/find-deck-by-id-and-user/find-deck-by-id-and-user.controller";

import { findDeckByIdAndUserUseCaseFactory } from "@/main/factories/use-cases/decks";

export const findDeckByIdAndUserControllerFactory = () => {
  const useCase = findDeckByIdAndUserUseCaseFactory();
  return new FindDeckByIdAndUserController(useCase);
};
