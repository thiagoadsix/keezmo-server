import { CreateCardUseCase } from "@/domain/use-cases/card/create-card.usecase";

import {
  cardRepositoryFactory,
  deckRepositoryFactory,
  progressRepositoryFactory,
} from "@/main/factories/repositories/dynamodb";

export const createCardUseCaseFactory = () => {
  const cardRepository = cardRepositoryFactory();
  const deckRepository = deckRepositoryFactory();
  const progressRepository = progressRepositoryFactory();

  return new CreateCardUseCase(
    cardRepository,
    deckRepository,
    progressRepository
  );
};
