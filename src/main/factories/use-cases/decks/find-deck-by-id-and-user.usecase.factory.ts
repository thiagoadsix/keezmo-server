import { FindDeckByIdAndUserUseCase } from "@/domain/use-cases/deck/find-deck-by-id-and-user.usecase";

import { deckRepositoryFactory } from "@/main/factories/repositories/dynamodb";

export const findDeckByIdAndUserUseCaseFactory = () => {
  const deckRepository = deckRepositoryFactory();
  return new FindDeckByIdAndUserUseCase(deckRepository);
};
