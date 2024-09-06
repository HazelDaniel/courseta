import { Request, Response } from "express";
import { CreatorAttributeUpdateType, ServerPayloadType } from "../../../../types";
import { UserModel } from '../../../../models/v1/user.model.js';
import { ServerError } from '../../../../utils.js';

export const updateProfile = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const creatorID = req.params.creator_id;
  const updatePayload: CreatorAttributeUpdateType = {
    ...(req.body as CreatorAttributeUpdateType),
    userID: creatorID,
  };
  try {
    await UserModel.updateFields(updatePayload, "creator");
  } catch (err) {
    throw new ServerError(
      `could not update fields, check inputs and try again!`,
      400
    );
  }
  const resPayload: ServerPayloadType<string> = {
    message: "success!",
    ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
  };
  return res.status(200).json(resPayload);
};

