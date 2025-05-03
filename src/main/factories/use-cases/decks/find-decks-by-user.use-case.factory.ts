import { FindDecksByUserUseCase } from "@/domain/use-cases/deck/find-decks-by-user.usecase";

import { deckRepositoryFactory } from "@/main/factories/repositories/dynamodb";

export const findDecksByUserUseCaseFactory = () => {
  const deckRepository = deckRepositoryFactory();
  return new FindDecksByUserUseCase(deckRepository);
};
