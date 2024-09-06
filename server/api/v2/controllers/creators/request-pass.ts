import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types";
import { CreatorModel } from "../../../../models/v1/creator.model.js";

export const requestPass = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { creator_id: creatorID } = req.params;
  const resultPass = await CreatorModel.requestPass(creatorID);
  const resPayload: ServerPayloadType<string> = {
    payload: resultPass,
    message: "creator pass update success!",
    ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
  };
  return res.status(200).json(resPayload);
};
