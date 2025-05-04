import { updateDeckControllerFactory } from "@/main/factories/controllers/decks";

import { lambdaAdapter } from "@/main/adapters/aws/lambda.adapters";

import { middyfy } from "@/shared/middyfy";

const updateDeckController = updateDeckControllerFactory();
const handler = lambdaAdapter(updateDeckController);

export const main = middyfy(handler);
