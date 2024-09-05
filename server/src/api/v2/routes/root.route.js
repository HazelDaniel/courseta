var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ErrorBoundary } from "../middlewares/error.middleware.js";
import { v2AssessmentsRouter } from "./assessments.route.js";
import { v2CoursesRouter } from "./courses.route.js";
import { v2CreatorsRouter } from "./creators.route.js";
import { v2ExamsRouter } from "./exams.route.js";
import { v2StudentsRouter } from "./students.route.js";
import { v2QuizzesRouter } from "./quizzes.route.js";
import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import jwt from "jsonwebtoken";
import expressSession from "express-session";
import RedisStore from "connect-redis";
import { createClient } from "redis";
import { serializeDeserializeUser } from "../middlewares/auth.middleware.js";
import { CreatorModel } from "../../../models/v1/creator.model.js";
import { ServerError, checkPasswordAgainstHash, log } from "../../../utils.js";
import { StudentModel } from "../../../models/v1/student.model.js";
import { UserModel } from "../../../models/v1/user.model.js";
import v2Config from "../config.js";
// SERVICES
import Mailer from "../services/mail.service.js";
import Template from "../services/template.service.js";
// TASKS
import { initJob } from "../jobs/vacuum-users.job.js";
initJob();
const redisClient = createClient({ url: v2Config.authOptions.redisStoreURL });
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.connect();
}))();
redisClient.on("connect", () => {
    log("redis connected sucessfully");
});
redisClient.on("error", (err) => {
    log("redis failed to connect: reason", err);
});
const redisStore = new RedisStore({
    client: redisClient,
    prefix: "courseta_session:",
});
export const v2Router = express.Router();
v2Router.use(expressSession({
    store: redisStore,
    secret: process.env.CST_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, //  7 days
}));
v2Router.use(serializeDeserializeUser);
passport.use("creators_local", new LocalStrategy({
    passwordField: "password",
    usernameField: "email",
    passReqToCallback: true,
}, (req, email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const creatorAuthPayload = req.body;
        const { creatorPass } = creatorAuthPayload;
        const resultCreator = yield CreatorModel.lookUp(email);
        if (!resultCreator)
            return done(new ServerError("invalid credentials!", 401));
        // return done(null, false);
        const { creatorPass: resultCreatorPass, password: hashedPassword, salt, } = resultCreator;
        if (creatorPass !== resultCreatorPass)
            return done(new ServerError("invalid creator pass!", 401));
        // return done(null, false);
        if (!(yield checkPasswordAgainstHash(password, hashedPassword, salt)))
            return done(new ServerError("invalid credentials!", 401));
        // return done(null, false);
        return done(null, {
            email,
            id: resultCreator.id,
            role: "creator",
        });
    }
    catch (err) {
        done(err);
    }
})));
passport.use("students_local", new LocalStrategy({
    passwordField: "password",
    usernameField: "email",
    passReqToCallback: true,
}, (req, email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    const resultStudent = yield StudentModel.lookUp(email);
    if (!resultStudent)
        return done(new ServerError("invalid credentials!", 401));
    const { password: hashedPassword, salt } = resultStudent;
    if (!(yield checkPasswordAgainstHash(password, hashedPassword, salt)))
        return done(new ServerError("invalid credentials!", 401));
    return done(null, {
        email,
        id: resultStudent.id,
        role: "student",
    });
})));
v2Router.use(passport.initialize());
v2Router.use(passport.session());
v2Router.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`[${req.method}] TO: ${req.baseUrl}${req.url}, AT: ${new Date().toString()}, FROM: ${req.ip}`);
    next();
}));
v2Router.use("/creators", v2CreatorsRouter);
v2Router.use("/courses", v2CoursesRouter);
v2Router.use("/students", v2StudentsRouter);
v2Router.use("/assessments", v2AssessmentsRouter);
v2Router.use("/exams", v2ExamsRouter);
v2Router.use("/quizzes", v2QuizzesRouter);
v2Router.get("/users/current", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        let deserializedUser = user;
        const emptyPayload = {
            payload: null,
            message: "",
            user: undefined,
        };
        if (!user)
            return res.status(200).json(emptyPayload);
        const resInfo = yield UserModel.search(deserializedUser.id, deserializedUser.role);
        const tmpPayload = {
            payload: null,
            message: "",
            user: Object.assign(Object.assign({}, deserializedUser), resInfo),
        };
        return res.status(200).json(tmpPayload);
    }
    catch (err) {
        next(err);
    }
}));
v2Router.get("/verify", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
    }
    catch (err) {
        next(err);
    }
}));
v2Router.get("/*", (req, res) => {
    return res.status(404).json({ message: "endpoint not found" });
});
v2Router.use(ErrorBoundary);
