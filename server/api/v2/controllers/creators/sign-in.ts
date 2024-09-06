import { Request, Response } from "express";
import { ServerPayloadType } from '../../../../types';

export const signIn = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { user } = req;
  const resPayload: ServerPayloadType<string> = {
    message: "user authenticated successfully!",
    ...(() => (user ? ({ user } as Express.User) : null))(),
  };
  return res.status(200).json(resPayload);
};

