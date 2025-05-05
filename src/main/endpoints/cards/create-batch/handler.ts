import { createCardsBatchControllerFactory } from "@/main/factories/controllers/cards";
import { lambdaAdapter } from "@/main/adapters/aws/lambda.adapters";
import { middyfy } from "@/shared/middyfy";

const createCardsBatchController = createCardsBatchControllerFactory();
const handler = lambdaAdapter(createCardsBatchController);

export const main = middyfy(handler);
