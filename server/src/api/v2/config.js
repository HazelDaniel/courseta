import { config } from "dotenv";
config({ path: [".env", ".env.dev", ".env.prod"] });
export const v2Config = {
    hashingOptions: {
        digest: "md5",
        encoding: "base64",
        iterations: 30000,
        keyLength: 64,
        saltByteCount: 10,
    },
    serverOptions: {
        imageServerBaseUrl: process.env.CST_CONTEXT === "prod"
            ? `${process.env.CST_PROD_IMAGE_SERVER_URL}`
            : `http://localhost:${process.env.IMAGE_SERVER_PORT}`,
        debugMode: !!(process.env.CST_CONTEXT === "test"),
        clientURL: process.env.CST_CONTEXT === "test"
            ? `${process.env.CST_CLIENT_URL_DEV}`
            : `${process.env.CST_CLIENT_URL_PROD}`,
    },
    authOptions: {
        jwtSecret: process.env.CST_JWT_SECRET,
        redisStoreURL: process.env.CST_CONTEXT === "prod"
            ? `${process.env.CST_PROD_REDIS_SESSION_URL}`
            : `${process.env.CST_TEST_REDIS_SESSION_URL}`,
    },
    serviceOptions: {
        platformEmail: `${process.env.CST_PLATFORM_EMAIL}`,
    },
};
export default v2Config;
