import {
  BatchWriteItemCommand,
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';

import { Card } from '@/domain/entities/card';
import { CardDynamoSchema } from './schemas/card.schema';
import { CardRepository } from '@/domain/interfaces/repositories';

export class CardDynamoRepository implements CardRepository {
  constructor(private readonly client: DynamoDBClient) {}

  async findById(id: string): Promise<Card | null> {
    const command = new GetItemCommand({
      TableName: process.env.DECK_TABLE_NAME,
      Key: { id: { S: id } },
    });

    const result = await this.client.send(command);

    if (result.Item) {
      return CardDynamoSchema.fromDynamoItem(result.Item);
    }

    return null;
  }

  async findByDeckId(deckId: string): Promise<Card[]> {
    const command = new QueryCommand({
      TableName: process.env.DECK_TABLE_NAME,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': { S: CardDynamoSchema.buildPK(deckId) },
      },
    });

    const result = await this.client.send(command);

    if (result.Items) {
      return result.Items.map(item => CardDynamoSchema.fromDynamoItem(item));
    }

    return [];
  }

  async save(card: Card): Promise<void> {
    const schema = new CardDynamoSchema(card);
    const command = new PutItemCommand({
      TableName: process.env.DECK_TABLE_NAME,
      Item: schema.toMarshall(),
    });

    await this.client.send(command);
  }

  async deleteById(id: string): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: process.env.DECK_TABLE_NAME,
      Key: { id: { S: id } },
    });

    await this.client.send(command);
  }

  async deleteByIds(ids: string[]): Promise<void> {
    const toDelete = ids.map(id => ({
      DeleteRequest: {
        Key: { id: { S: id } },
      },
    }));

    const params = {
      [process.env.DECK_TABLE_NAME]: toDelete,
    };

    const command = new BatchWriteItemCommand({
      RequestItems: params,
    });

    await this.client.send(command);
  }

  async saveBatch(cards: Card[]): Promise<void> {
    const schema = cards.map(card => new CardDynamoSchema(card));

    const chunk = 25;

    for (let i = 0; i < schema.length; i += chunk) {
      const batch = schema.slice(i, i + chunk);

      const command = new BatchWriteItemCommand({
        RequestItems: {
          [process.env.DECK_TABLE_NAME]: batch.map(schema => schema.toMarshall()),
        },
      });

      await this.client.send(command);
    }
  }
}
