import { lambdaAdapter } from "@/main/adapters/aws/lambda.adapters";
import { startStudySessionControllerFactory } from "@/main/factories/controllers/study-sessions";

import { middyfy } from "@/shared/middyfy";

const startStudySessionController = startStudySessionControllerFactory();
const handler = lambdaAdapter(startStudySessionController);

export const main = middyfy(handler);
