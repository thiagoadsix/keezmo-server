import "aws-lambda";

declare module "aws-lambda" {
  interface APIGatewayProxyEventBase {
    user: {
      id: string;
    };
  }
}
