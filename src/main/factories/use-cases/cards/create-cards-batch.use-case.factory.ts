import { CreateCardsBatchUseCase } from "@/domain/use-cases/card/create-cards-batch.usecase";

import {
  cardRepositoryFactory,
  deckRepositoryFactory,
  progressRepositoryFactory,
} from "@/main/factories/repositories/dynamodb";

export const createCardsBatchUseCaseFactory = () => {
  const cardRepository = cardRepositoryFactory();
  const deckRepository = deckRepositoryFactory();
  const progressRepository = progressRepositoryFactory();

  return new CreateCardsBatchUseCase(
    cardRepository,
    deckRepository,
    progressRepository
  );
};
