import { Deck } from '@/domain/entities/deck'
import { DeckRepository } from '@/domain/interfaces/repositories'

interface FindDecksByUserRequest {
  userId: string
}

type FindDecksByUserResponse = Deck[]

export class FindDecksByUserUseCase {
  constructor(private readonly deckRepository: DeckRepository) {}

  async execute(
    request: FindDecksByUserRequest,
  ): Promise<FindDecksByUserResponse> {
    console.log(`Starting FindDecksByUserUseCase for userId: ${request.userId}`)

    const decks = await this.deckRepository.findAllByUser(request.userId)

    console.log(`Found ${decks.length} decks for user ${request.userId}`)

    return decks
  }
}
