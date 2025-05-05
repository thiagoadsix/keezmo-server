import { endStudySessionControllerFactory } from "@/main/factories/controllers/study-sessions";
import { lambdaAdapter } from "@/main/adapters/aws/lambda.adapters";

import { middyfy } from "@/shared/middyfy";

const endStudySessionController = endStudySessionControllerFactory();
const handler = lambdaAdapter(endStudySessionController);

export const main = middyfy(handler);
