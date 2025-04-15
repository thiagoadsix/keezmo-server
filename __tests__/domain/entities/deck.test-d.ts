import { expectTypeOf, test } from 'vitest'

import { Card } from '@/domain/entities/card'
import { Deck } from '@/domain/entities/deck'
import { DeckType } from '@/domain/value-objects/deck-type'

test('Deck has the correct property types', () => {
  const deck = new Deck({
    title: 'Test Deck',
    description: 'Test Description',
    type: new DeckType('flashcard'),
  })

  expectTypeOf(deck.id).toBeString()
  expectTypeOf(deck.title).toBeString()
  expectTypeOf(deck.description).toBeString()
  // TODO: search which method will replace toMatchTypeOf (since is deprecated)
  expectTypeOf(deck.type).toMatchTypeOf<DeckType>()
  expectTypeOf(deck.cards).toEqualTypeOf<Card[]>()
  expectTypeOf(deck.createdAt).toBeString()
  expectTypeOf(deck.updatedAt).toBeString()

  expectTypeOf(deck.updateTitle).toBeFunction()
  expectTypeOf(deck.updateTitle).parameter(0).toBeString()
  expectTypeOf(deck.updateTitle).returns.toBeVoid()

  expectTypeOf(deck.updateDescription).toBeFunction()
  expectTypeOf(deck.updateDescription).parameter(0).toBeString()
  expectTypeOf(deck.updateDescription).returns.toBeVoid()

  expectTypeOf(deck.updateType).toBeFunction()
  // TODO: search which method will replace toMatchTypeOf (since is deprecated)
  expectTypeOf(deck.updateType).parameter(0).toMatchTypeOf<DeckType>()
  expectTypeOf(deck.updateType).returns.toBeVoid()

  expectTypeOf(deck.addCard).toBeFunction()
  // TODO: search which method will replace toMatchTypeOf (since is deprecated)
  expectTypeOf(deck.addCard).parameter(0).toMatchTypeOf<Card>()
  expectTypeOf(deck.addCard).returns.toBeVoid()

  expectTypeOf(deck.removeCard).toBeFunction()
  expectTypeOf(deck.removeCard).parameter(0).toBeString()
  expectTypeOf(deck.removeCard).returns.toBeVoid()

  expectTypeOf(deck.getCardById).toBeFunction()
  expectTypeOf(deck.getCardById).parameter(0).toBeString()
  expectTypeOf(deck.getCardById).returns.toEqualTypeOf<Card | undefined>()
})
