import { Card } from '@/domain/entities/card'
import { Deck } from '@/domain/entities/deck'
import { DeckRepository } from '@/domain/interfaces/deck-repository'
import { StudyMode, StudyModeEnum } from '@/domain/value-objects'

interface CreateDeckRequest {
  userId: string
  title: string
  description: string
  studyMode: StudyModeEnum
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

    const studyMode = new StudyMode(request.studyMode)

    const deck = new Deck({
      userId: request.userId,
      title: request.title,
      description: request.description,
      studyMode,
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
