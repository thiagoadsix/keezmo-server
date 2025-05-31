import { FindDeckByIdAndUserUseCase } from "@/domain/use-cases/deck/find-deck-by-id-and-user.usecase";

import { cardRepositoryFactory, deckRepositoryFactory } from "@/main/factories/repositories/dynamodb";

export const findDeckByIdAndUserUseCaseFactory = () => {
  const deckRepository = deckRepositoryFactory();
  const cardRepository = cardRepositoryFactory();
  return new FindDeckByIdAndUserUseCase(deckRepository, cardRepository);
};
