import 'next';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PG_USER_NAME: string;
      PG_HOST_NAME: string;
      PG_PORT: number;
      PG_PASSWORD: string;
      PG_DB_NAME: string;
    }
  }
}
