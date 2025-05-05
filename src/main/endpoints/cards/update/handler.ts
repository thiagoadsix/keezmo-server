import { lambdaAdapter } from "@/main/adapters/aws/lambda.adapters";
import { updateCardControllerFactory } from "@/main/factories/controllers/cards";

import { middyfy } from "@/shared/middyfy";

const updateCardController = updateCardControllerFactory();
const handler = lambdaAdapter(updateCardController);

export const main = middyfy(handler);
