import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";

import {
  FindDecksStatsValidator,
  FindDecksStatsValidatorRequest,
} from "./find-decks-stats.validator";

export type FindDecksStatsRequest = FindDecksStatsValidatorRequest;

export interface FindDecksStatsResponse {
  decks: {
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
  }[];
  totalCards: number;
  totalDueCards: number;
}

export class FindDecksStatsController extends BaseController<
  FindDecksStatsRequest,
  FindDecksStatsResponse
> {
  constructor(
    useCase: UseCase<FindDecksStatsRequest, FindDecksStatsResponse>,
    validator: Validator<FindDecksStatsRequest> = new FindDecksStatsValidator()
  ) {
    super(useCase, validator);
  }
}
