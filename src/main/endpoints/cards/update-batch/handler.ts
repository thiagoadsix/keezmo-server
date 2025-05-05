import { lambdaAdapter } from "@/main/adapters/aws/lambda.adapters";
import { updateCardsBatchControllerFactory } from "@/main/factories/controllers/cards";

import { middyfy } from "@/shared/middyfy";

const updateCardsBatchController = updateCardsBatchControllerFactory();
const handler = lambdaAdapter(updateCardsBatchController);

export const main = middyfy(handler);
