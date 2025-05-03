import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";
import { Controller } from "@/presentation/protocols/controller.protocol";

import {
  ReviewCardValidator,
  ReviewCardValidatorRequest,
} from "./review-card.validator";

import { Progress } from "@/domain/entities/progress";

export type ReviewCardRequest = ReviewCardValidatorRequest;

export interface ReviewCardResponse {
  progress: Progress;
  nextReview: Date;
}

export class ReviewCardController extends BaseController<
  ReviewCardRequest,
  ReviewCardResponse
> {
  constructor(
    useCase: UseCase<ReviewCardRequest, ReviewCardResponse>,
    validator: Validator<ReviewCardRequest> = new ReviewCardValidator()
  ) {
    super(useCase, validator);
  }
}

// TODO: for now, but in future we will move to main layer where we will have the factory method implementations
export const makeReviewCardController = (
  useCase: UseCase<ReviewCardRequest, ReviewCardResponse>
): Controller<ReviewCardRequest, ReviewCardResponse> => {
  const validator = new ReviewCardValidator();
  return new ReviewCardController(useCase, validator);
};
