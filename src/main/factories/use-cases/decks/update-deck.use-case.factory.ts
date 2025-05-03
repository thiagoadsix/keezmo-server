import { UpdateDeckUseCase } from "@/domain/use-cases/deck/update-deck.usecase";

import { deckRepositoryFactory } from "@/main/factories/repositories/dynamodb";

export const updateDeckUseCaseFactory = () => {
  const deckRepository = deckRepositoryFactory();
  return new UpdateDeckUseCase(deckRepository);
};
