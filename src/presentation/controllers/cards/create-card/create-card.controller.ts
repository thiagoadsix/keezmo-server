import { Card } from "@/domain/entities/card";
import { Progress } from "@/domain/entities/progress";

import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";
import {
  HttpRequest,
  HttpResponse,
  ok,
} from "@/presentation/protocols/http.protocol";
import { Controller } from "@/presentation/protocols/controller.protocol";

import {
  CreateCardValidator,
  CreateCardValidatorRequest,
} from "./create-card.validator";

export type CreateCardRequest = CreateCardValidatorRequest;

export interface CreateCardResponse {
  card: Card;
  progress: Progress;
}

interface CreateCardUseCaseRequest {
  deckId: string;
  userId: string;
  data: {
    question: string;
    answer: string;
  };
}

export class CreateCardController extends BaseController<
  CreateCardUseCaseRequest,
  CreateCardResponse
> {
  private readonly createCardValidator: Validator<CreateCardRequest>;
  private readonly createCardUseCase: UseCase<
    CreateCardUseCaseRequest,
    CreateCardResponse
  >;

  constructor(
    useCase: UseCase<CreateCardUseCaseRequest, CreateCardResponse>,
    validator: Validator<CreateCardRequest> = new CreateCardValidator()
  ) {
    super(useCase);
    this.createCardValidator = validator;
    this.createCardUseCase = useCase;
  }

  async handle(
    httpRequest: HttpRequest<unknown>
  ): Promise<HttpResponse<CreateCardResponse>> {
    const validatedRequest = this.createCardValidator.validate(httpRequest);

    const useCaseRequest: CreateCardUseCaseRequest = {
      deckId: validatedRequest.params.deckId,
      userId: validatedRequest.user.id,
      data: {
        question: validatedRequest.body.question,
        answer: validatedRequest.body.answer,
      },
    };

    const result = await this.createCardUseCase.execute(useCaseRequest);

    return ok(result);
  }
}

// TODO: for now, but in future we will move to main layer where we will have the factory method implementations
export const makeCreateCardController = (
  useCase: UseCase<CreateCardUseCaseRequest, CreateCardResponse>
): Controller<CreateCardRequest, CreateCardResponse> => {
  const validator = new CreateCardValidator();
  return new CreateCardController(useCase, validator);
};
