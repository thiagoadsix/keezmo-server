import { FindCardsByDeckIdUseCase } from "@/domain/use-cases/card/find-cards-by-deck-id.usecase";

import {
  cardRepositoryFactory,
  deckRepositoryFactory,
} from "@/main/factories/repositories/dynamodb";

export const findCardsByDeckIdUseCaseFactory = () => {
  const cardRepository = cardRepositoryFactory();
  const deckRepository = deckRepositoryFactory();

  return new FindCardsByDeckIdUseCase(cardRepository, deckRepository);
};
