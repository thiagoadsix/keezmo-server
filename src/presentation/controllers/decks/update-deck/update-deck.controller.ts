import { Deck } from "@/domain/entities/deck";

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
  UpdateDeckValidator,
  UpdateDeckValidatorRequest,
} from "./update-deck.validator";

export type UpdateDeckRequest = UpdateDeckValidatorRequest;

export type UpdateDeckResponse = Deck;

interface UpdateDeckUseCaseRequest {
  deckId: string;
  userId: string;
  data: {
    title?: string;
    description?: string;
    studyMode?: string;
  };
}

export class UpdateDeckController extends BaseController<
  UpdateDeckUseCaseRequest,
  UpdateDeckResponse
> {
  private readonly updateDeckValidator: Validator<UpdateDeckRequest>;
  private readonly updateDeckUseCase: UseCase<
    UpdateDeckUseCaseRequest,
    UpdateDeckResponse
  >;

  constructor(
    useCase: UseCase<UpdateDeckUseCaseRequest, UpdateDeckResponse>,
    validator: Validator<UpdateDeckRequest> = new UpdateDeckValidator()
  ) {
    super(useCase);
    this.updateDeckValidator = validator;
    this.updateDeckUseCase = useCase;
  }

  async handle(
    httpRequest: HttpRequest<unknown>
  ): Promise<HttpResponse<UpdateDeckResponse>> {
    const validatedRequest = this.updateDeckValidator.validate(httpRequest);

    const useCaseRequest: UpdateDeckUseCaseRequest = {
      deckId: validatedRequest.params.id,
      userId: validatedRequest.user.id,
      data: validatedRequest.body,
    };

    const result = await this.updateDeckUseCase.execute(useCaseRequest);

    return ok(result);
  }
}

// TODO: for now, but in future we will move to main layer where we will have the factory method implementations
export const makeUpdateDeckController = (
  useCase: UseCase<UpdateDeckUseCaseRequest, UpdateDeckResponse>
): Controller<UpdateDeckRequest, UpdateDeckResponse> => {
  const validator = new UpdateDeckValidator();
  return new UpdateDeckController(useCase, validator);
};
