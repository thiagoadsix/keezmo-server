import { describe, expect, it, vi } from "vitest";

import {
  FindDeckStatsController,
  FindDeckStatsRequest,
  FindDeckStatsResponse,
  FindDeckStatsValidator,
} from "@/presentation/controllers/decks/find-deck-stats";

describe("FindDeckStatsController", () => {
  it("should be a class", () => {
    expect(FindDeckStatsController).toBeInstanceOf(Function);
  });

  it("should return ok response when use case returns a success response", async () => {
    const mockStats: FindDeckStatsResponse = {
      deck: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
        title: "Test Deck",
      },
      cards: {
        total: 50,
        new: 10,
        learning: 15,
        mature: 25,
        due: 5,
      },
      performance: {
        successRate: 85.5,
        averageEaseFactor: 2.5,
        currentStreak: 7,
      },
      forecast: [
        {
          date: "2023-05-01",
          count: 5,
        },
        {
          date: "2023-05-02",
          count: 3,
        },
      ],
    };

    const useCase = {
      execute: vi.fn().mockResolvedValue(mockStats),
    };

    const validator = new FindDeckStatsValidator();
    const validatorSpy = vi
      .spyOn(validator, "validate")
      .mockImplementation((data) => data as FindDeckStatsRequest);

    const controller = new FindDeckStatsController(useCase, validator);

    const validRequest = {
      params: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d4",
      },
      user: {
        id: "3fa1adbb-6beb-4d46-813b-9ece825d39d1",
      },
    };

    const response = await controller.handle(validRequest);

    expect(validatorSpy).toHaveBeenCalledWith(validRequest);
    expect(useCase.execute).toHaveBeenCalledWith(validRequest);
    expect(response).toEqual({
      statusCode: 200,
      body: mockStats,
    });
  });
});
