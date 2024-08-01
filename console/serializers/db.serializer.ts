import { BufferLike } from "../types.js";
import {
  base64ToBuffer,
  base64toDataURL,
  bufferToBase64,
  parseBase64Data,
} from "../utils.js";

export const serializeImage: (
  base64Image: string
) => { data: string; mime: string } | null = (base64Image) => {
  // console.log("before serialization;--------");
  // console.log(base64Image);
  const base64Result = parseBase64Data(base64Image);
  if (base64Result) {
    const { data, mime } = base64Result;
    const res = { data, mime };
    // console.log("after serialization");
    // console.log(res);
    return res;
  }
  return null;
};