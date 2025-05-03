import { createDeckControllerFactory } from "@/main/factories/controllers/decks";
import { lambdaAdapter } from "@/main/adapters/aws/lambda.adapters";
import { middyfy } from "@/shared/middyfy";

const createDeckController = createDeckControllerFactory();
const handler = lambdaAdapter(createDeckController);

export const main = middyfy(handler);
