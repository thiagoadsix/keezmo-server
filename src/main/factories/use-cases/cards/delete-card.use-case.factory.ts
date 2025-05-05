import { DeleteCardUseCase } from "@/domain/use-cases/card/delete-card.usecase";

import {
  cardRepositoryFactory,
  deckRepositoryFactory,
  progressRepositoryFactory,
} from "@/main/factories/repositories/dynamodb";

export const deleteCardUseCaseFactory = () => {
  const cardRepository = cardRepositoryFactory();
  const deckRepository = deckRepositoryFactory();
  const progressRepository = progressRepositoryFactory();

  return new DeleteCardUseCase(
    cardRepository,
    deckRepository,
    progressRepository
  );
};
