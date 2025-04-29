declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AWS_REGION: string;
      ENVIRONMENT: 'development' | 'production' | 'local';
    }
  }
}

export {};
