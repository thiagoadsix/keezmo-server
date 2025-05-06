import { findDecksStatsControllerFactory } from "@/main/factories/controllers/decks";
import { lambdaAdapter } from "@/main/adapters/aws/lambda.adapters";

import { middyfy } from "@/shared/middyfy";

const findDecksStatsController = findDecksStatsControllerFactory();
const handler = lambdaAdapter(findDecksStatsController);

export const main = middyfy(handler);
