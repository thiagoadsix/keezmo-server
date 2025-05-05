import { FindDecksByUserUseCase } from "@/domain/use-cases/deck/find-decks-by-user.usecase";

import { cardRepositoryFactory, deckRepositoryFactory } from "@/main/factories/repositories/dynamodb";

export const findDecksByUserUseCaseFactory = () => {
  const deckRepository = deckRepositoryFactory();
  const cardRepository = cardRepositoryFactory();
  return new FindDecksByUserUseCase(deckRepository, cardRepository);
};
