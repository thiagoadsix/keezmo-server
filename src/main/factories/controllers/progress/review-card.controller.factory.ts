import { ReviewCardController } from "@/presentation/controllers/progress/review-card";

import { reviewCardUseCaseFactory } from "@/main/factories/use-cases/progress";

export const reviewCardControllerFactory = () => {
  const useCase = reviewCardUseCaseFactory();
  return new ReviewCardController(useCase);
};
