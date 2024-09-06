import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import { UserAuthPayloadType } from "../../../../client.types";
import v2Config from '../../config.js';
import { CreatorModel } from '../../../../models/v1/creator.model.js';
import Template from '../../services/template.service.js';
import Mailer from '../../services/mail.service.js';
import { ServerPayloadType } from '../../../../types';

export const signUp = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
    const creatorAuthPayload: UserAuthPayloadType =
      req.body as UserAuthPayloadType;
    const { user } = req;
    const { email, firstName, lastName, password } = creatorAuthPayload;
    const verificationID = jwt.sign(
      { uuid: randomUUID() },
      v2Config.authOptions.jwtSecret,
      { expiresIn: "24h" }
    );
    const pendingCreator = new CreatorModel(
      email,
      password,
      firstName,
      lastName,
      undefined,
      undefined,
      verificationID
    );
    const userID = await pendingCreator.save();
    const messageEmail = new Template({
      type: "verificationLink",
      data: {
        verificationLink: `${v2Config.serverOptions.clientURL}/auth?verification_id=${verificationID}&user_id=${userID}`,
      },
    }).generate;
    Mailer.sendEmail(v2Config.serviceOptions.platformEmail, {
      html: messageEmail,
      subject: "verification link from courseta",
      text: "Hi, below is your verification link:",
      to: email,
    });
    const resPayload: ServerPayloadType<string> = {
      message: "user registered successfully!",
      ...(() => (user ? ({ user } as Express.User) : null))(),
    };
    return res.status(201).json(resPayload);
};
