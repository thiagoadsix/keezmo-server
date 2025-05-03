import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";

import {
  FindDeckStatsValidator,
  FindDeckStatsValidatorRequest,
} from "./find-deck-stats.validator";

export type FindDeckStatsRequest = FindDeckStatsValidatorRequest;

export interface FindDeckStatsResponse {
  deck: {
    id: string;
    title: string;
  };
  cards: {
    total: number;
    new: number;
    learning: number;
    mature: number;
    due: number;
  };
  performance: {
    successRate: number;
    averageEaseFactor: number;
    currentStreak: number;
  };
  forecast: {
    date: string;
    count: number;
  }[];
}

export class FindDeckStatsController extends BaseController<
  FindDeckStatsRequest,
  FindDeckStatsResponse
> {
  constructor(
    useCase: UseCase<FindDeckStatsRequest, FindDeckStatsResponse>,
    validator: Validator<FindDeckStatsRequest> = new FindDeckStatsValidator()
  ) {
    super(useCase, validator);
  }
}
