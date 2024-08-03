import { ConfigOption } from "../../types";


export const v1Config: ConfigOption = {
  hashingOptions: {
    digest: "md5",
    encoding: "base64",
    iterations: 30000,
    keyLength: 64,
    saltByteCount: 10,
  },
};

export default v1Config;