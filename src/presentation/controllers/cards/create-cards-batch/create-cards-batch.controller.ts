import { Controller } from "@/presentation/protocols/controller.protocol";

import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";
import {
  HttpRequest,
  HttpResponse,
  created,
} from "@/presentation/protocols/http.protocol";

import {
  CreateCardsBatchValidator,
  CreateCardsBatchValidatorRequest,
} from "./create-cards-batch.validator";

export type CreateCardsBatchRequest = CreateCardsBatchValidatorRequest;

export type CreateCardsBatchResponse = void;

interface CardData {
  question: string;
  answer: string;
}

interface CreateCardsBatchUseCaseRequest {
  deckId: string;
  userId: string;
  cards: CardData[];
}

export class CreateCardsBatchController extends BaseController<
  CreateCardsBatchUseCaseRequest,
  CreateCardsBatchResponse
> {
  private readonly createCardsBatchValidator: Validator<CreateCardsBatchRequest>;
  private readonly createCardsBatchUseCase: UseCase<
    CreateCardsBatchUseCaseRequest,
    CreateCardsBatchResponse
  >;

  constructor(
    useCase: UseCase<CreateCardsBatchUseCaseRequest, CreateCardsBatchResponse>,
    validator: Validator<CreateCardsBatchRequest> = new CreateCardsBatchValidator()
  ) {
    super(useCase);
    this.createCardsBatchValidator = validator;
    this.createCardsBatchUseCase = useCase;
  }

  async handle(
    httpRequest: HttpRequest<unknown>
  ): Promise<HttpResponse<CreateCardsBatchResponse>> {
    const validatedRequest =
      this.createCardsBatchValidator.validate(httpRequest);

    const useCaseRequest: CreateCardsBatchUseCaseRequest = {
      deckId: validatedRequest.params.deckId,
      userId: validatedRequest.user.id,
      cards: validatedRequest.body.cards,
    };

    await this.createCardsBatchUseCase.execute(useCaseRequest);

    return created(undefined);
  }
}

// TODO: for now, but in future we will move to main layer where we will have the factory method implementations
export const makeCreateCardsBatchController = (
  useCase: UseCase<CreateCardsBatchUseCaseRequest, CreateCardsBatchResponse>
): Controller<CreateCardsBatchRequest, CreateCardsBatchResponse> => {
  const validator = new CreateCardsBatchValidator();
  return new CreateCardsBatchController(useCase, validator);
};
