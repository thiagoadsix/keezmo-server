import { findCardsByDeckIdControllerFactory } from "@/main/factories/controllers/cards";
import { lambdaAdapter } from "@/main/adapters/aws/lambda.adapters";
import { middyfy } from "@/shared/middyfy";

const findCardsByDeckIdController = findCardsByDeckIdControllerFactory();
const handler = lambdaAdapter(findCardsByDeckIdController);

export const main = middyfy(handler);
