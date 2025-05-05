import { findDeckByIdAndUserControllerFactory } from "@/main/factories/controllers/decks";
import { lambdaAdapter } from "@/main/adapters/aws/lambda.adapters";

import { middyfy } from "@/shared/middyfy";

const findDeckByIdAndUserController = findDeckByIdAndUserControllerFactory();
const handler = lambdaAdapter(findDeckByIdAndUserController);

export const main = middyfy(handler);
