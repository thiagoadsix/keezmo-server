import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";
import { Controller } from "@/presentation/protocols/controller.protocol";

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

// TODO: for now, but in future we will move to main layer where we will have the factory method implementations
export const makeFindDeckStatsController = (
  useCase: UseCase<FindDeckStatsRequest, FindDeckStatsResponse>
): Controller<FindDeckStatsRequest, FindDeckStatsResponse> => {
  const validator = new FindDeckStatsValidator();
  return new FindDeckStatsController(useCase, validator);
};
