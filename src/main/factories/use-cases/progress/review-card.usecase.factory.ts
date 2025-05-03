import { ReviewCardUseCase } from "@/domain/use-cases/progress/review-card.usecase";

import {
  cardRepositoryFactory,
  progressRepositoryFactory,
} from "@/main/factories/repositories/dynamodb";

export const reviewCardUseCaseFactory = () => {
  const cardRepository = cardRepositoryFactory();
  const progressRepository = progressRepositoryFactory();

  return new ReviewCardUseCase(progressRepository, cardRepository);
};
