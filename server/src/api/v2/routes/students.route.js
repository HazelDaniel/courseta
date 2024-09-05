var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { randomUUID } from "crypto";
import express from "express";
import passport from "passport";
import { StudentModel } from "../../../models/v1/student.model.js";
import { ServerError } from "../../../utils.js";
import jwt from "jsonwebtoken";
import { CourseModel } from "../../../models/v1/course.model.js";
import { UserModel } from "../../../models/v1/user.model.js";
import { AssessmentModel } from "../../../models/v1/assessment.model.js";
import { studentIDProtected, studentsLocalProtected, } from "../middlewares/auth.middleware.js";
import v2Config from "../config.js";
import Mailer from "../services/mail.service.js";
import Template from "../services/template.service.js";
export const v2StudentsRouter = express.Router();
v2StudentsRouter.use(passport.initialize());
// v2StudentsRouter.use(serializeDeserializeUser);
v2StudentsRouter.post("/auth/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const creatorAuthPayload = req.body;
        const { email, firstName, lastName, password } = creatorAuthPayload;
        const verificationID = jwt.sign({ uuid: randomUUID() }, v2Config.authOptions.jwtSecret, { expiresIn: "24h" });
        const pendingStudent = new StudentModel(email, password, firstName, lastName, undefined, undefined, verificationID);
        const userID = yield pendingStudent.save();
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
        const resPayload = Object.assign({ message: "user registered successfully!" }, (() => (req.user ? { user: req.user } : null))());
        return res.status(201).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v2StudentsRouter.post("/auth/login", passport.authenticate("students_local"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resPayload = Object.assign({ message: "user authenticated successfully!" }, (() => (req.user ? { user: req.user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v2StudentsRouter.use(studentsLocalProtected);
v2StudentsRouter.get("/:student_id/courses", studentIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { student_id: studentID } = req.params;
    try {
        const resCourses = yield CourseModel.all({
            variant: "student",
            studentID,
        });
        const resPayload = Object.assign({ payload: resCourses, message: null }, (() => (req.user ? { user: req.user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v2StudentsRouter.get("/:student_id/courses/recommended", studentIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { student_id: studentID } = req.params;
        const recommendedCourses = yield CourseModel.allRecommended(studentID);
        const resPayload = Object.assign({ message: null, payload: recommendedCourses }, (() => (req.user ? { user: req.user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v2StudentsRouter.get("/:student_id/courses/unfinished", studentIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { student_id: studentID } = req.params;
        const unfinishedCourses = yield CourseModel.allRecentUnfinished(studentID);
        const resPayload = Object.assign({ message: null, payload: unfinishedCourses }, (() => (req.user ? { user: req.user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v2StudentsRouter.get("/:student_id/reports", studentIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { student_id: studentID } = req.params;
        const reports = yield AssessmentModel.getAssessmentsReportFor(studentID);
        const resPayload = Object.assign({ message: null, payload: reports }, (() => (req.user ? { user: req.user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v2StudentsRouter.get("/:student_id/me", studentIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentEmail = req.user.email;
        const resStudent = yield StudentModel.getProfile(studentEmail);
        const resPayload = Object.assign({ payload: resStudent, message: null }, (() => (req.user ? { user: req.user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v2StudentsRouter.put("/:student_id/me", studentIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { student_id: studentID } = req.params;
        const updatePayload = Object.assign(Object.assign({}, req.body), { userID: studentID });
        try {
            yield UserModel.updateFields(updatePayload, "student");
        }
        catch (err) {
            console.error(err);
            throw new ServerError("could not update fields, check inputs and try again!", 400);
        }
        const resPayload = Object.assign({ message: "success!" }, (() => (req.user ? { user: req.user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v2StudentsRouter.post("/:student_id/logout", studentIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.logOut((err) => {
            if (err)
                return next(err);
            return res.status(200).json();
        });
    }
    catch (err) {
        next(err);
    }
}));
