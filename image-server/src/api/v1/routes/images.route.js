var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ImageModel } from "./../../../models/v1/image.model.js";
import express from "express";
export const v1ImagesRouter = express.Router();
import { ServerError } from "../../../utils.js";
v1ImagesRouter.get("/:image_id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { image_id: imageID } = req.params;
        try {
            const mimeType = req.headers["x-mime_type"];
            if (!mimeType || typeof mimeType !== "string")
                throw new ServerError("mime type not included in headers", 400);
            const resImage = yield ImageModel.search(imageID, mimeType);
            const resPayload = {
                message: null,
                payload: resImage,
            };
            return res.status(200).json(resPayload);
        }
        catch (err) {
            if (err instanceof ServerError && err.code === 404) {
                const resPayload = {
                    message: "image not found!",
                    payload: null,
                };
                return res.status(err.code).json(resPayload);
            }
        }
    }
    catch (err) {
        next(err);
    }
}));
v1ImagesRouter.put("/:image_id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { image_id: imageID } = req.params;
        const imageReqBody = req.body;
        const { newAvatar } = imageReqBody;
        yield ImageModel.replace(imageID, newAvatar[0]);
        return res.status(204).json();
    }
    catch (err) {
        next(err);
    }
}));
v1ImagesRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageReqBody = req.body;
        const { id, imageUrl } = imageReqBody;
        const newImage = new ImageModel(imageUrl, id);
        yield newImage.save();
        const resPayload = {
            message: "image created successfully!",
            payload: null,
        };
        return res.status(201).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v1ImagesRouter.delete("/:image_id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { image_id: imageID } = req.params;
        yield ImageModel.delete(imageID);
        return res.status(204).json();
    }
    catch (err) {
        next(err);
    }
}));
