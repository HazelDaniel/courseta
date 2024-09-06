import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types.js";
import { UserModel } from "../../../../models/v1/user.model.js";
import { ServerError } from "../../../../utils.js";
import v2Config from "../../config.js";

// SERVICES
import Template from "../../services/template.service.js";
import Mailer from "../../services/mail.service.js";

export const verifyUser = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { query, user } = req;
  const { verification_id, user_id } = query;
  if (!verification_id || !user_id)
    throw new ServerError("you cannot verify with this credential", 400);
  jwt.verify(
    verification_id as string,
    v2Config.authOptions.jwtSecret,
    async (err, decoded) => {
      if (err) throw new ServerError("invalid verification parameters", 401);
      const { creatorPass, verificationID, email } =
        await UserModel.getVerificationCredentials(user_id as string);
      if (verificationID === verification_id)
        await UserModel.validate(user_id as string);
      else throw new ServerError("invalid verification parameters", 401);
      if (!creatorPass) {
        // student flow
        const resPayload: ServerPayloadType<null> = {
          message: "",
          payload: null,
          ...(() => (user ? ({ user } as Express.User) : null))(),
        };
        return res.status(200).json(resPayload);
      }
      const messageEmail = new Template({
        type: "creatorPass",
        data: { creatorPass },
      }).generate;
      Mailer.sendEmail(v2Config.serviceOptions.platformEmail, {
        html: messageEmail,
        subject: "creator pass from courseta",
        text: "Hi creator, below is your creator pass. you can now explore the platform :",
        to: email,
      });
      const resPayload: ServerPayloadType<null> = {
        message: "",
        payload: null,
        ...(() => (user ? ({ user } as Express.User) : null))(),
      };
      return res.status(200).json(resPayload);
    }
  );
};
