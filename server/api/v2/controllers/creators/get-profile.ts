import { Request, Response } from "express";
import { CreatorSessionUserType, ServerPayloadType } from "../../../../types";
import { CreatorModel } from "../../../../models/v1/creator.model.js";

export const getProfile = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const creatorEmail = (req.user as CreatorSessionUserType).email;
  const resCreator = await CreatorModel.getProfile(creatorEmail);
  const resPayload: ServerPayloadType<typeof resCreator> = {
    payload: resCreator,
    message: null,
  };
  return res.status(200).json(resPayload);
};
