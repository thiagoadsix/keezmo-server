import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { Controller } from "@/presentation/protocols/controller.protocol";
import { HttpRequest } from "@/presentation/protocols/http.protocol";

/**
 * Adapter to convert AWS Lambda events to our controller interface
 * and format the response back to AWS Lambda format
 */
export const lambdaAdapter = (controller: Controller) => {
  return async (
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> => {
    try {
      // Extract request data from the event and convert to compatible types
      const httpRequest: HttpRequest = {
        body:
          typeof event.body === "string"
            ? JSON.parse(event.body)
            : event.body || {},
        // Ensure no undefined values in path parameters
        params: event.pathParameters
          ? Object.entries(event.pathParameters).reduce((acc, [key, value]) => {
              if (value !== undefined) {
                acc[key] = value;
              }
              return acc;
            }, {} as Record<string, string>)
          : {},
        // Convert array query params to string
        query: event.queryStringParameters
          ? Object.entries(event.queryStringParameters).reduce(
              (acc, [key, value]) => {
                acc[key] = Array.isArray(value) ? value.join(",") : value || "";
                return acc;
              },
              {} as Record<string, string>
            )
          : {},
        // Ensure no undefined values in headers
        headers: event.headers
          ? Object.entries(event.headers).reduce((acc, [key, value]) => {
              if (value !== undefined) {
                acc[key] = value;
              }
              return acc;
            }, {} as Record<string, string>)
          : {},
        user: event.user,
      };

      // Pass the request to our controller
      const httpResponse = await controller.handle(httpRequest);

      // Format the response for API Gateway
      return {
        statusCode: httpResponse.statusCode,
        headers: {
          "Content-Type": "application/json",
          ...httpResponse.headers,
        },
        body: JSON.stringify(httpResponse.body),
      };
    } catch (error: unknown) {
      // Handle errors
      const errorMessage =
        error instanceof Error ? error.message : "Internal server error";
      const statusCode =
        error instanceof Error && "statusCode" in error
          ? (error as { statusCode: number }).statusCode
          : 500;

      return {
        statusCode,
        body: JSON.stringify({
          message: errorMessage,
        }),
      };
    }
  };
};
