var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import { UserModel } from "../../../models/v1/user.model.js";
import { ServerError } from "../../../utils.js";
import v2Config from '../config.js';
// SERVICES
import Template from '../services/template.service.js';
import Mailer from '../services/mail.service.js';
export const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query, user } = req;
    const { verification_id, user_id } = query;
    if (!verification_id || !user_id)
        throw new ServerError("you cannot verify with this credential", 400);
    jwt.verify(verification_id, v2Config.authOptions.jwtSecret, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            throw new ServerError("invalid verification parameters", 401);
        const { creatorPass, verificationID, email } = yield UserModel.getVerificationCredentials(user_id);
        if (verificationID === verification_id)
            yield UserModel.validate(user_id);
        else
            throw new ServerError("invalid verification parameters", 401);
        if (!creatorPass) {
            // student flow
            const resPayload = Object.assign({ message: "", payload: null }, (() => (user ? { user } : null))());
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
        const resPayload = Object.assign({ message: "", payload: null }, (() => (user ? { user } : null))());
        return res.status(200).json(resPayload);
    }));
});
