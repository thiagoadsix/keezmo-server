import { FindDecksByUserController } from "@/presentation/controllers/decks/find-decks-by-user/find-decks-by-user.controller";

import { findDecksByUserUseCaseFactory } from "@/main/factories/use-cases/decks";

export const findDecksByUserControllerFactory = () => {
  const useCase = findDecksByUserUseCaseFactory();
  return new FindDecksByUserController(useCase);
};
