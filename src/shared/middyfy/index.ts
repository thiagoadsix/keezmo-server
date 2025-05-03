import { Handler } from "aws-lambda";

import httpSecurityHeaders from "@middy/http-security-headers";
import jsonBodyParser from "@middy/http-json-body-parser";
import middy from "@middy/core";

import { userMiddleware } from "./middleware/user.middleware";

export const middyfy = (handler: Handler) => {
  return middy(handler)
    .use(jsonBodyParser())
    .use(httpSecurityHeaders())
    .use(userMiddleware());
};
