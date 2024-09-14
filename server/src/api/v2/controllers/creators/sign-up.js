var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import v2Config from '../../config.js';
import { CreatorModel } from '../../../../models/v1/creator.model.js';
import Template from '../../services/template.service.js';
import Mailer from '../../services/mail.service.js';
export const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const creatorAuthPayload = req.body;
    const { user } = req;
    const { email, firstName, lastName, password } = creatorAuthPayload;
    const verificationID = jwt.sign({ uuid: randomUUID() }, v2Config.authOptions.jwtSecret, { expiresIn: "24h" });
    const pendingCreator = new CreatorModel(email, password, firstName, lastName, undefined, undefined, verificationID);
    const userID = yield pendingCreator.save();
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
    const resPayload = Object.assign({ message: "user registered successfully!" }, (() => (user ? { user } : null))());
    return res.status(201).json(resPayload);
});
