import { findDecksByUserControllerFactory } from "@/main/factories/controllers/decks";
import { lambdaAdapter } from "@/main/adapters/aws/lambda.adapters";

import { middyfy } from "@/shared/middyfy";

const findDecksByUserController = findDecksByUserControllerFactory();
const handler = lambdaAdapter(findDecksByUserController);

export const main = middyfy(handler);
