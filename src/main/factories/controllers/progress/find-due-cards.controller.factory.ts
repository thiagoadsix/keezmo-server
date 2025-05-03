import { FindDueCardsController } from "@/presentation/controllers/progress/find-due-cards/find-due-cards.controller";

import { findDueCardsUseCaseFactory } from "@/main/factories/use-cases/progress";

export const findDueCardsControllerFactory = () => {
  const useCase = findDueCardsUseCaseFactory();
  return new FindDueCardsController(useCase);
};
