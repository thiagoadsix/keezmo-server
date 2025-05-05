import {
  CardRepository,
  DeckRepository,
  ProgressRepository,
} from "@/domain/interfaces/repositories";
import { CardNotFoundError } from "@/domain/errors/card/card-not-found-error";
import { DeckNotFoundError } from "@/domain/errors/deck/deck-not-found-error";
import { ProgressNotFoundError } from "@/domain/errors/progress";

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

    const card = await this.cardRepository.findByIdAndDeckId(id, deckId);
    if (!card) {
      throw new CardNotFoundError(id, deckId);
    }

    // TODO: This is not correct, we should have an error for when DeckID mismatch
    if (card.deckId !== deckId) {
      throw new CardNotFoundError(id, deckId);
    }

    const progress = await this.progressRepository.findByCardAndDeck(
      id,
      deckId
    );

    if (!progress) {
      throw new ProgressNotFoundError(id, deckId);
    }

    await Promise.allSettled([
      this.progressRepository.deleteByIdAndDeckId(progress.id, deckId),
      this.cardRepository.deleteByIdAndDeckId(id, deckId),
    ]);

    console.log(
      `Successfully deleted card ${id} and progress from deck ${deckId}`
    );
  }
}
