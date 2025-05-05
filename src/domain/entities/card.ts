import { InvalidCardAnswerError } from "@/domain/errors/card/invalid-card-answer-error";
import { InvalidCardQuestionError } from "@/domain/errors/card/invalid-card-question-error";

import { generateId } from "@/shared/utils/generate-id";

interface CardProps {
  id?: string | null;
  deckId: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

export class Card {
  public readonly id: string;
  public readonly deckId: string;
  public question: string;
  public answer: string;
  public readonly createdAt: string;
  public updatedAt: string;

  constructor(props: CardProps) {
    if (!this.isValidQuestion(props.question)) {
      throw new InvalidCardQuestionError(props.question);
    }

    if (!this.isValidAnswer(props.answer)) {
      throw new InvalidCardAnswerError(props.answer);
    }

    this.id = props.id ?? generateId();
    this.deckId = props.deckId;
    this.question = props.question;
    this.answer = props.answer;
    this.createdAt = props.createdAt || new Date().toISOString();
    this.updatedAt = props.updatedAt || this.createdAt;
  }

  private isValidQuestion(question: string): boolean {
    return (
      question !== null && question !== undefined && question.trim().length > 0
    );
  }

  private isValidAnswer(answer: string): boolean {
    return answer !== null && answer !== undefined && answer.trim().length > 0;
  }

  public updateQuestion(newQuestion: string): void {
    if (!this.isValidQuestion(newQuestion)) {
      throw new InvalidCardQuestionError(newQuestion);
    }

    this.question = newQuestion;
    this.updatedAt = new Date().toISOString();
  }

  public updateAnswer(newAnswer: string): void {
    if (!this.isValidAnswer(newAnswer)) {
      throw new InvalidCardAnswerError(newAnswer);
    }

    this.answer = newAnswer;
    this.updatedAt = new Date().toISOString();
  }
}
