import { handlerPath } from "@/shared/utils/handler-path";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "GET",
        path: "decks/{deckId}/cards/progress/due",
        cors: true,
      },
    },
  ],
};
