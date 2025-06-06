import type { AWS } from "@serverless/typescript";

import createDeck from "@/main/endpoints/decks/create";
import deleteDeck from "@/main/endpoints/decks/delete";
import findDeckByIdAndUser from "@/main/endpoints/decks/find-by-id-and-user";
import findDeckStats from "@/main/endpoints/decks/find-stats";
import findDecksByUser from "@/main/endpoints/decks/find-by-user";
import findDecksStats from "@/main/endpoints/decks/find-all-states";
import updateDeck from "@/main/endpoints/decks/update";

import createCard from "@/main/endpoints/cards/create";
import createCardsBatch from "@/main/endpoints/cards/create-batch";
import deleteCard from "@/main/endpoints/cards/delete";
import findCardsByDeckId from "@/main/endpoints/cards/find-by-deck";
import updateCard from "@/main/endpoints/cards/update";
import updateCardsBatch from "@/main/endpoints/cards/update-batch";

import findDueCards from "@/main/endpoints/progress/find-due-cards";
import initializeProgress from "@/main/endpoints/progress/initialize";
import reviewCard from "@/main/endpoints/progress/review-card";

import endStudySession from "@/main/endpoints/study-sessions/end-study-session";
import findStudySessionsByUser from "@/main/endpoints/study-sessions/find-by-user";
import startStudySession from "@/main/endpoints/study-sessions/start-study-session";

const serverlessConfiguration: AWS = {
  service: "keezmo-service",
  frameworkVersion: "4",
  plugins: ["serverless-offline"],
  useDotenv: true,
  provider: {
    name: "aws",
    runtime: "nodejs22.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      DECK_TABLE_NAME: "${env:DECK_TABLE_NAME}",
    },
  },
  functions: {
    createDeck,
    deleteDeck,
    findDeckByIdAndUser,
    findDeckStats,
    findDecksByUser,
    findDecksStats,
    updateDeck,

    createCard,
    createCardsBatch,
    deleteCard,
    findCardsByDeckId,
    updateCard,
    updateCardsBatch,

    findDueCards,
    initializeProgress,
    reviewCard,

    startStudySession,
    endStudySession,
    findStudySessionsByUser,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node20",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 2,
    },
  },
};

module.exports = serverlessConfiguration;
