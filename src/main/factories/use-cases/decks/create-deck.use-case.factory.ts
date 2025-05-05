import { CreateDeckUseCase } from "@/domain/use-cases/deck/create-deck.usecase";

import { deckRepositoryFactory } from "@/main/factories/repositories/dynamodb";

export const createDeckUseCaseFactory = () => {
  const deckRepository = deckRepositoryFactory();
  return new CreateDeckUseCase(deckRepository);
};
