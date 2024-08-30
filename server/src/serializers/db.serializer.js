import { parseBase64Data, } from "../utils.js";
export const serializeImage = (base64Image) => {
    // console.log("before serialization;--------");
    // console.log(base64Image.slice(0, 30));
    const base64Result = parseBase64Data(base64Image);
    if (base64Result) {
        const { data, mime } = base64Result;
        const res = { data, mime };
        // console.log("after serialization");
        // console.log(res.data.slice(0, 30));
        return res;
    }
    return null;
};
