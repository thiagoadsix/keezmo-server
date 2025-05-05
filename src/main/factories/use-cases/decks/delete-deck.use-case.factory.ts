import { DeleteDeckUseCase } from "@/domain/use-cases/deck/delete-deck.usecase";

import {
  cardRepositoryFactory,
  deckRepositoryFactory,
  progressRepositoryFactory,
} from "@/main/factories/repositories/dynamodb";

export const deleteDeckUseCaseFactory = () => {
  const deckRepository = deckRepositoryFactory();
  const cardRepository = cardRepositoryFactory();
  const progressRepository = progressRepositoryFactory();

  return new DeleteDeckUseCase(
    deckRepository,
    cardRepository,
    progressRepository
  );
};
