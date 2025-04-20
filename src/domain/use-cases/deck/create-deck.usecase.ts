import { Card } from '@/domain/entities/card'
import { Deck } from '@/domain/entities/deck'
import { DeckRepository } from '@/domain/interfaces/deck-repository'
import { DeckType } from '@/domain/value-objects/deck-type'

interface CreateDeckRequest {
  title: string
  description: string
  type: string
  cards?: Array<{
    question: string
    answer: string
    options?: string[]
    answerIndex?: number
  }>
}

type CreateDeckResponse = void

export class CreateDeckUseCase {
  constructor(private readonly deckRepository: DeckRepository) {}

  async execute(request: CreateDeckRequest): Promise<CreateDeckResponse> {
    console.log(`Starting CreateDeckUseCase with title: ${request.title}`)

    const deckType = new DeckType(request.type)

    const deck = new Deck({
      title: request.title,
      description: request.description,
      type: deckType,
    })

    if (request.cards && request.cards.length > 0) {
      console.log(`Creating ${request.cards.length} cards for deck ${deck.id}`)

      request.cards.forEach((cardData) => {
        const card = new Card({
          deckId: deck.id,
          question: cardData.question,
          answer: cardData.answer,
          options: cardData.options,
          answerIndex: cardData.answerIndex,
        })

        deck.addCard(card)
      })
    }

    await this.deckRepository.save(deck)

    console.log(`Deck created successfully with id: ${deck.id}`)
  }
}
