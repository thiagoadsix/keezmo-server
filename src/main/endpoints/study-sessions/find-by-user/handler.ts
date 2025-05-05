import { findStudySessionsByUserControllerFactory } from "@/main/factories/controllers/study-sessions";
import { lambdaAdapter } from "@/main/adapters/aws/lambda.adapters";

import { middyfy } from "@/shared/middyfy";

const findStudySessionsByUserController = findStudySessionsByUserControllerFactory();
const handler = lambdaAdapter(findStudySessionsByUserController);

export const main = middyfy(handler);
