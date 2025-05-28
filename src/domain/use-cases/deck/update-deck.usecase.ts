import { Deck } from "@/domain/entities/deck";
import { DeckNotFoundError } from "@/domain/errors/deck/deck-not-found-error";
import { DeckRepository } from "@/domain/interfaces/repositories";
import { StudyMode } from "@/domain/value-objects";

interface DeckUpdateData {
  title: string;
  description: string;
  studyMode: string;
}

interface UpdateDeckRequest {
  id: string;
  userId: string;
  data: Partial<DeckUpdateData>;
}

type UpdateDeckResponse = Deck;

export class UpdateDeckUseCase {
  constructor(private readonly deckRepository: DeckRepository) {}

  async execute(request: UpdateDeckRequest): Promise<UpdateDeckResponse> {
    console.log(
      `Starting UpdateDeckUseCase for id: ${request.id}, userId: ${request.userId}, data: ${JSON.stringify(request.data, null, 2)}`
    );

    const deck = await this.deckRepository.findByIdAndUserId(
      request.id,
      request.userId
    );

    if (!deck) {
      console.log(
        `Deck with ID ${request.id} not found for user ${request.userId}`
      );
      throw new DeckNotFoundError(request.id, request.userId);
    }

    console.log(`Found deck: ${deck.title}, applying updates`);

    this.applyUpdates(deck, request.data);

    await this.deckRepository.save(deck);

    console.log(`Successfully updated deck ${request.id}`);
    return deck;
  }

  private applyUpdates(
    deck: Deck,
    updateData: UpdateDeckRequest["data"]
  ): void {
    if (updateData.title && updateData.title !== deck.title) {
      deck.updateTitle(updateData.title);
    }

    if (updateData.description && updateData.description !== deck.description) {
      deck.updateDescription(updateData.description);
    }

    if (
      updateData.studyMode &&
      updateData.studyMode !== deck.studyMode.getValue()
    ) {
      deck.updateStudyMode(new StudyMode(updateData.studyMode));
    }
  }
}
