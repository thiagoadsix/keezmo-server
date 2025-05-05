import { createCardControllerFactory } from "@/main/factories/controllers/cards";
import { lambdaAdapter } from "@/main/adapters/aws/lambda.adapters";
import { middyfy } from "@/shared/middyfy";

const createCardController = createCardControllerFactory();
const handler = lambdaAdapter(createCardController);

export const main = middyfy(handler);
