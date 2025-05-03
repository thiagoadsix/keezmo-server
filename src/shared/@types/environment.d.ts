declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AWS_REGION: string;
      IS_OFFLINE: "true" | "false";
      ENVIRONMENT: "development" | "production";
      DECK_TABLE_NAME: string;
    }
  }
}

export {};
