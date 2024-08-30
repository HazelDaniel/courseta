import { base64toDataURL } from "../utils.js";
export const deserializeImage = (base64String, mimeType) => {
    try {
        // console.log("before deserialization:------------ ");
        // console.log(base64String.slice(0, 130));
        const deserializedToken = base64toDataURL(base64String, mimeType);
        // console.log("after deserialization:------------ ");
        // console.log(deserializedToken?.slice(0, 130));
        return deserializedToken;
    }
    catch (err) {
        return null;
    }
};
