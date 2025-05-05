import { deleteDeckControllerFactory } from "@/main/factories/controllers/decks";
import { lambdaAdapter } from "@/main/adapters/aws/lambda.adapters";

import { middyfy } from "@/shared/middyfy";

const deleteDeckController = deleteDeckControllerFactory();
const handler = lambdaAdapter(deleteDeckController);

export const main = middyfy(handler);
