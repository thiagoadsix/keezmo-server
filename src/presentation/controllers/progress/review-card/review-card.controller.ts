import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";

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
