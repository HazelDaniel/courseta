import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types.js";
import { UserModel } from "../../../../models/v1/user.model.js";
import { SessionUserType } from "../../../../client.types.js";

export const getCurrentUser = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { user } = req;

  let deserializedUser: Express.User & SessionUserType = user as Express.User &
    SessionUserType;

  const emptyPayload: ServerPayloadType<null> = {
    payload: null,
    message: "",
    user: undefined,
  };
  if (!user) return res.status(200).json(emptyPayload);

  const resInfo = await UserModel.search(
    deserializedUser.id,
    deserializedUser.role
  );

  const tmpPayload: ServerPayloadType<null> = {
    payload: null,
    message: "",
    user: { ...deserializedUser, ...resInfo },
  };
  return res.status(200).json(tmpPayload);
};
