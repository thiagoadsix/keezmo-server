import { UpdateCardsBatchUseCase } from "@/domain/use-cases/card/update-cards-batch.usecase";

import {
  cardRepositoryFactory,
  deckRepositoryFactory,
} from "@/main/factories/repositories/dynamodb";

export const updateCardsBatchUseCaseFactory = () => {
  const cardRepository = cardRepositoryFactory();
  const deckRepository = deckRepositoryFactory();

  return new UpdateCardsBatchUseCase(cardRepository, deckRepository);
};
