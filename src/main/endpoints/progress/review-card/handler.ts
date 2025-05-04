import { lambdaAdapter } from "@/main/adapters/aws/lambda.adapters";
import { reviewCardControllerFactory } from "@/main/factories/controllers/progress";

import { middyfy } from "@/shared/middyfy";

const reviewCardController = reviewCardControllerFactory();
const handler = lambdaAdapter(reviewCardController);

export const main = middyfy(handler);
