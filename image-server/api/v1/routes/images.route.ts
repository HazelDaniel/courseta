import { ImageModel } from "./../../../models/v1/image.model.js";
import express from "express";
export const v1ImagesRouter = express.Router();
import type {
  ImageCreationPayloadType,
  ImageSearchPayloadType,
  ImageUpdatePayloadType,
} from "../../../client.types";
import { ServerPayloadType } from "../../../types.js";
import { ServerError } from "../../../utils.js";

v1ImagesRouter.get("/:image_id", async (req, res, next) => {
  try {
    const { image_id: imageID } = req.params;
    try {
      const mimeType = req.headers["x-mime_type"];
      if (!mimeType || typeof mimeType !== "string")
        throw new ServerError("mime type not included in headers", 400);
      const resImage = await ImageModel.search(imageID, mimeType);
      const resPayload: ServerPayloadType<typeof resImage> = {
        message: null,
        payload: resImage,
      };
      return res.status(200).json(resPayload);
    } catch (err) {
      if (err instanceof ServerError && err.code === 404) {
        const resPayload: ServerPayloadType<null> = {
          message: "image not found!",
          payload: null,
        };
        return res.status(err.code).json(resPayload);
      }
    }
  } catch (err) {
    next(err);
  }
});

v1ImagesRouter.put("/:image_id", async (req, res, next) => {
  try {
    const { image_id: imageID } = req.params;
    const imageReqBody: ImageUpdatePayloadType =
      req.body as ImageUpdatePayloadType;
    const { newAvatar } = imageReqBody;
    await ImageModel.replace(imageID, newAvatar[0]);
    return res.status(204).json();
  } catch (err) {
    next(err);
  }
});

v1ImagesRouter.post("/", async (req, res, next) => {
  try {
    const imageReqBody: ImageCreationPayloadType =
      req.body as ImageCreationPayloadType;
    const { id, imageUrl } = imageReqBody;
    const newImage = new ImageModel(imageUrl, id);
    await newImage.save();
    const resPayload: ServerPayloadType<null> = {
      message: "image created successfully!",
      payload: null,
    };
    return res.status(201).json(resPayload);
  } catch (err) {
    next(err);
  }
});

v1ImagesRouter.delete("/:image_id", async (req, res, next) => {
  try {
    const { image_id: imageID } = req.params;
    await ImageModel.delete(imageID);
    return res.status(204).json();
  } catch (err) {
    next(err);
  }
});
