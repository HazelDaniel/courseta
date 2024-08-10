import { ConfigOption } from "../../types";
import { config } from "dotenv";
config({path: [".env"]});


export const v1Config: ConfigOption = {
  hashingOptions: {
    digest: "md5",
    encoding: "base64",
    iterations: 30000,
    keyLength: 64,
    saltByteCount: 10,
  },
  serverOptions: {
    imageServerBaseUrl: `http://localhost:${process.env.IMAGE_SERVER_PORT}/api/v1/images`
  }
};

export default v1Config;