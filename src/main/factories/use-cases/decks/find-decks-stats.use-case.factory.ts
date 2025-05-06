import { FindDecksStatsUseCase } from "@/domain/use-cases/deck/find-decks-stats.usecase";

import {
  cardRepositoryFactory,
  deckRepositoryFactory,
  progressRepositoryFactory,
} from "@/main/factories/repositories/dynamodb";

export const findDecksStatsUseCaseFactory = () => {
  const deckRepository = deckRepositoryFactory();
  const cardRepository = cardRepositoryFactory();
  const progressRepository = progressRepositoryFactory();

  return new FindDecksStatsUseCase(
    deckRepository,
    cardRepository,
    progressRepository
  );
};
