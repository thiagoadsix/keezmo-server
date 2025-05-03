import { UpdateCardUseCase } from "@/domain/use-cases/card/update-card.usecase";

import {
  cardRepositoryFactory,
  deckRepositoryFactory,
} from "@/main/factories/repositories/dynamodb";

export const updateCardUseCaseFactory = () => {
  const cardRepository = cardRepositoryFactory();
  const deckRepository = deckRepositoryFactory();

  return new UpdateCardUseCase(cardRepository, deckRepository);
};
