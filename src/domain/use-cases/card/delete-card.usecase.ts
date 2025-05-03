import {
  CardRepository,
  DeckRepository,
  ProgressRepository,
} from "@/domain/interfaces/repositories";
import { CardNotFoundError } from "@/domain/errors/card/card-not-found-error";
import { DeckNotFoundError } from "@/domain/errors/deck/deck-not-found-error";

interface DeleteCardRequest {
  id: string;
  deckId: string;
  userId: string;
}

type DeleteCardResponse = void;

export class DeleteCardUseCase {
  constructor(
    private cardRepository: CardRepository,
    private deckRepository: DeckRepository,
    private progressRepository: ProgressRepository
  ) {}

  async execute(request: DeleteCardRequest): Promise<DeleteCardResponse> {
    const { id, deckId, userId } = request;

    console.log(`Starting DeleteCardUseCase for id: ${id}, deckId: ${deckId}`);

    const deck = await this.deckRepository.findByIdAndUserId(deckId, userId);
    if (!deck) {
      throw new DeckNotFoundError(deckId, userId);
    }

    const card = await this.cardRepository.findById(id);
    if (!card) {
      throw new CardNotFoundError(id, deckId);
    }

    if (card.deckId !== deckId) {
      throw new CardNotFoundError(id, deckId);
    }

    await Promise.allSettled([
      this.progressRepository.deleteById(id),
      this.cardRepository.deleteById(id),
    ]);

    console.log(
      `Successfully deleted card ${id} and progress from deck ${deckId}`
    );
  }
}
