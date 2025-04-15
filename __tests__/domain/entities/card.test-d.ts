import { expectTypeOf, test } from 'vitest'

import { Card } from '@/domain/entities/card'

test('Card has the correct property types', () => {
  const card = new Card({
    deckId: 'deck-id',
    question: 'Test Question',
    answer: 'Test Answer',
  })

  expectTypeOf(card.id).toBeString()
  expectTypeOf(card.deckId).toBeString()
  expectTypeOf(card.question).toBeString()
  expectTypeOf(card.answer).toBeString()
  expectTypeOf(card.options).toEqualTypeOf<string[] | undefined>()
  expectTypeOf(card.answerIndex).toEqualTypeOf<number | undefined>()
  expectTypeOf(card.createdAt).toBeString()
  expectTypeOf(card.updatedAt).toBeString()

  expectTypeOf(card.updateQuestion).toBeFunction()
  expectTypeOf(card.updateQuestion).parameter(0).toBeString()
  expectTypeOf(card.updateQuestion).returns.toBeVoid()

  expectTypeOf(card.updateAnswer).toBeFunction()
  expectTypeOf(card.updateAnswer).parameter(0).toBeString()
  expectTypeOf(card.updateAnswer).returns.toBeVoid()

  expectTypeOf(card.updateOptions).toBeFunction()
  expectTypeOf(card.updateOptions).parameter(0).toEqualTypeOf<string[]>()
  expectTypeOf(card.updateOptions).returns.toBeVoid()

  expectTypeOf(card.updateAnswerIndex).toBeFunction()
  expectTypeOf(card.updateAnswerIndex).parameter(0).toBeNumber()
  expectTypeOf(card.updateAnswerIndex).returns.toBeVoid()
})
