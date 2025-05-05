import { FindDeckStatsController } from "@/presentation/controllers/decks/find-deck-stats/find-deck-stats.controller";

import { findDeckStatsUseCaseFactory } from "@/main/factories/use-cases/decks";

export const findDeckStatsControllerFactory = () => {
  const useCase = findDeckStatsUseCaseFactory();
  return new FindDeckStatsController(useCase);
};
