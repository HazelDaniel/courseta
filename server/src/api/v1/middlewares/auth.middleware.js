var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ServerError } from "../../../utils.js";
// import { StudentSessionUserType } from "../../../types.js";
import passport from "passport";
export const creatorsLocalProtected = (req, res, next) => {
    if (!req.isAuthenticated())
        next(new ServerError("only authenticated creators can access this route", 401));
    next();
};
export const creatorIDProtected = (req, res, next) => {
    const { creator_id: creatorID } = req.params;
    if (req.user.id !== creatorID)
        next(new ServerError("you are not allowed to access this route!", 403));
    next();
};
export const studentsLocalProtected = (req, res, next) => {
    if (!req.isAuthenticated())
        next(new ServerError("only authenticated students can access this route", 401));
    next();
};
export const studentIDProtected = (req, res, next) => {
    const { student_id: studentID } = req.params;
    if (req.user.id !== studentID)
        next(new ServerError("you are not allowed to access this route!", 403));
    next();
};
export const serializeDeserializeUser = (req, res, next) => {
    passport.serializeUser((user, callback) => __awaiter(void 0, void 0, void 0, function* () {
        const response = user;
        process.nextTick(function () {
            callback(null, {
                id: response.id,
                email: response.email,
                role: response.role,
            });
        });
    }));
    passport.deserializeUser(function (user, callback) {
        process.nextTick(function () {
            callback(null, user);
        });
    });
    next();
};
