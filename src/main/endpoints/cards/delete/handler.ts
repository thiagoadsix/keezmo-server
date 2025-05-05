import { deleteCardControllerFactory } from "@/main/factories/controllers/cards";
import { lambdaAdapter } from "@/main/adapters/aws/lambda.adapters";
import { middyfy } from "@/shared/middyfy";

const deleteCardController = deleteCardControllerFactory();
const handler = lambdaAdapter(deleteCardController);

export const main = middyfy(handler);
