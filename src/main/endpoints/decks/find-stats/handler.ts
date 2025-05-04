import { findDeckStatsControllerFactory } from "@/main/factories/controllers/decks";
import { lambdaAdapter } from "@/main/adapters/aws/lambda.adapters";

import { middyfy } from "@/shared/middyfy";

const findDeckStatsController = findDeckStatsControllerFactory();
const handler = lambdaAdapter(findDeckStatsController);

export const main = middyfy(handler);
