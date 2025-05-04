import { findDueCardsControllerFactory } from "@/main/factories/controllers/progress";
import { lambdaAdapter } from "@/main/adapters/aws/lambda.adapters";

import { middyfy } from "@/shared/middyfy";

const findDueCardsController = findDueCardsControllerFactory();
const handler = lambdaAdapter(findDueCardsController);

export const main = middyfy(handler);
