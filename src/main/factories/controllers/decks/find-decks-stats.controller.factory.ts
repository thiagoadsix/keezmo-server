import { FindDecksStatsController } from "@/presentation/controllers/decks/find-decks-stats/find-decks-stats.controller";

import { findDecksStatsUseCaseFactory } from "@/main/factories/use-cases/decks";

export const findDecksStatsControllerFactory = () => {
  const useCase = findDecksStatsUseCaseFactory();
  return new FindDecksStatsController(useCase);
};
