import { handlerPath } from "@/shared/utils/handler-path";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "PATCH",
        path: "/decks/{deckId}/cards/{id}",
        cors: true,
      },
    },
  ],
};
