import {
  BaseController,
  UseCase,
  Validator,
} from "@/presentation/controllers/base.controller";
import {
  HttpRequest,
  HttpResponse,
  noContent,
} from "@/presentation/protocols/http.protocol";
import { Controller } from "@/presentation/protocols/controller.protocol";

import {
  DeleteCardValidator,
  DeleteCardValidatorRequest,
} from "./delete-card.validator";

export type DeleteCardRequest = DeleteCardValidatorRequest;

export type DeleteCardResponse = void;

interface DeleteCardUseCaseRequest {
  cardId: string;
  deckId: string;
  userId: string;
}

export class DeleteCardController extends BaseController<
  DeleteCardUseCaseRequest,
  DeleteCardResponse
> {
  private readonly deleteCardValidator: Validator<DeleteCardRequest>;
  private readonly deleteCardUseCase: UseCase<
    DeleteCardUseCaseRequest,
    DeleteCardResponse
  >;

  constructor(
    useCase: UseCase<DeleteCardUseCaseRequest, DeleteCardResponse>,
    validator: Validator<DeleteCardRequest> = new DeleteCardValidator()
  ) {
    super(useCase);
    this.deleteCardValidator = validator;
    this.deleteCardUseCase = useCase;
  }

  async handle(
    httpRequest: HttpRequest<unknown>
  ): Promise<HttpResponse<DeleteCardResponse>> {
    const validatedRequest = this.deleteCardValidator.validate(httpRequest);

    const useCaseRequest: DeleteCardUseCaseRequest = {
      cardId: validatedRequest.params.id,
      deckId: validatedRequest.params.deckId,
      userId: validatedRequest.user.id,
    };

    await this.deleteCardUseCase.execute(useCaseRequest);

    return noContent() as HttpResponse<void>;
  }
}

// TODO: for now, but in future we will move to main layer where we will have the factory method implementations
export const makeDeleteCardController = (
  useCase: UseCase<DeleteCardUseCaseRequest, DeleteCardResponse>
): Controller<DeleteCardRequest, DeleteCardResponse> => {
  const validator = new DeleteCardValidator();
  return new DeleteCardController(useCase, validator);
};
