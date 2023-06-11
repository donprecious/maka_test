/* eslint-disable prettier/prettier */
export const configConstant = {
  redis: {
    host: "REDIS_HOST",
    port: "REDIS_PORT",
    password: "REDIS_PASSWORD",
    storeDB: "REDIS_STORE_DB",
    prefix: "REDIS_STORE_PREFIX",
  },
  database: {
    host: "DATABASE_HOST",
    port: "DATABASE_PORT",
    username: "DATABASE_USERNAME",
    password: "DATABASE_PASSWORD",
    name: "DATABASE_NAME",
  },

  environment: "NODE_ENV",

  corsOrigin: {
    urls: "CORS_ORIGIN",
  },
};
