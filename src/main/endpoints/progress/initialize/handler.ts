import { initializeProgressControllerFactory } from "@/main/factories/controllers/progress";
import { lambdaAdapter } from "@/main/adapters/aws/lambda.adapters";

import { middyfy } from "@/shared/middyfy";

const initializeProgressController = initializeProgressControllerFactory();
const handler = lambdaAdapter(initializeProgressController);

export const main = middyfy(handler);
