declare namespace NodeJS {
  interface Process {
    /** running on server */
  }
  interface ProcessEnv {
    /** node environment */
    NODE_ENV: string;
    NAVER_MAP_CLIENT_ID: string;
    NAVER_MAP_CLIENT_SECRET: string;
    CLOUDFLARE_IMAGES_TOKEN: string;
    CLOUDFLARE_ACCOUNT_ID: string;
    SECRET_KEY: string;
    DATABASE_URL: string;
  }
}
