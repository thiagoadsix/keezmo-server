import { FindDueCardsUseCase } from "@/domain/use-cases/progress/find-due-cards.usecase";

import {
  cardRepositoryFactory,
  progressRepositoryFactory,
} from "@/main/factories/repositories/dynamodb";

export const findDueCardsUseCaseFactory = () => {
  const cardRepository = cardRepositoryFactory();
  const progressRepository = progressRepositoryFactory();

  return new FindDueCardsUseCase(progressRepository, cardRepository);
};
