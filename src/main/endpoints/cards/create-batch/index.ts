import { handlerPath } from "@/shared/utils/handler-path";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "POST",
        path: "decks/{deckId}/cards/batch",
        cors: true,
      },
    },
  ],
};
