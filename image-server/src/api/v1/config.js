import { config } from "dotenv";
config({ path: [".env", ".env.dev", ".env.prod"] });
export const v1Config = {
    hashingOptions: {
        digest: "md5",
        encoding: "base64",
        iterations: 30000,
        keyLength: 64,
        saltByteCount: 10,
    },
    serverOptions: {
        imageServerBaseUrl: `http://localhost:${process.env.IMAGE_SERVER_PORT}/api/v1/images`,
        debugMode: !!(process.env.CST_CONTEXT === "test"),
        jwtSecret: process.env.CST_JWT_SECRET,
        clientURL: process.env.CST_CONTEXT === "test" ? `${process.env.CST_CLIENT_URL_DEV}` : `${process.env.CST_CLIENT_URL_PROD}`
    },
    serviceOptions: {
        platformEmail: `${process.env.CST_PLATFORM_EMAIL}`
    }
};
export default v1Config;
