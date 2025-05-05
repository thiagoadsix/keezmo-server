import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import jwt from "jsonwebtoken";

import middy from "@middy/core";

export const userMiddleware = (): middy.MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> => {
  const before: middy.MiddlewareFn<
    APIGatewayProxyEvent,
    APIGatewayProxyResult
  > = async (request): Promise<void> => {
    const token = request.event.headers.Authorization;
    const tokenWithoutBearer = token?.split(" ")[1] ?? "";

    if (!token || !tokenWithoutBearer) {
      throw new Error("Token is required");
    }

    const decoded = jwt.decode(tokenWithoutBearer, {
      json: true,
      complete: true,
    });

    request.event.user = { id: decoded?.payload.sub?.toString() ?? "" };
  };

  return {
    before,
  };
};
