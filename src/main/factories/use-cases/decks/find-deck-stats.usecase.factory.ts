import { FindDeckStatsUseCase } from "@/domain/use-cases/deck/find-deck-stats.usecase";

import {
  cardRepositoryFactory,
  deckRepositoryFactory,
  progressRepositoryFactory,
} from "@/main/factories/repositories/dynamodb";

export const findDeckStatsUseCaseFactory = () => {
  const deckRepository = deckRepositoryFactory();
  const cardRepository = cardRepositoryFactory();
  const progressRepository = progressRepositoryFactory();

  return new FindDeckStatsUseCase(
    deckRepository,
    cardRepository,
    progressRepository
  );
};
