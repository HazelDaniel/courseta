import { base64toDataURL } from "../utils.js";
export const deserializeImage = (base64String, mimeType) => {
    // console.log("before deserialization:------------ ");
    // console.log(base64String, "mime-type: ", mimeType);
    const deserializedToken = base64toDataURL(base64String, mimeType);
    // console.log("after deserialization:------------ ");
    // console.log(deserializedToken);
    return deserializedToken;
};
