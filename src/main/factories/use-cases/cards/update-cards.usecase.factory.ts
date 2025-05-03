import { UpdateCardsUseCase } from "@/domain/use-cases/card/update-cards.usecase";

import {
  cardRepositoryFactory,
  deckRepositoryFactory,
} from "@/main/factories/repositories/dynamodb";

export const updateCardsUseCaseFactory = () => {
  const cardRepository = cardRepositoryFactory();
  const deckRepository = deckRepositoryFactory();

  return new UpdateCardsUseCase(cardRepository, deckRepository);
};
