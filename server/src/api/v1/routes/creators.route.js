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
import { creatorIDProtected, creatorsLocalProtected, } from "../middlewares/auth.middleware.js";
import jwt from "jsonwebtoken";
import { ServerError } from "../../../utils.js";
import { CourseModel } from "../../../models/v1/course.model.js";
import { LessonModel } from "../../../models/v1/lesson.model.js";
import { LessonContentModel } from "../../../models/v1/lesson-content.model.js";
import { QuizModel } from "../../../models/v1/quiz.model.js";
import { CreatorModel } from "../../../models/v1/creator.model.js";
import { UserModel } from "../../../models/v1/user.model.js";
import { ExamModel } from "../../../models/v1/exam.model.js";
import { QuestionModel } from "../../../models/v1/question.model.js";
import { AnswerModel } from "../../../models/v1/answer.model.js";
import fetch from "node-fetch";
import v1Config from "../config.js";
import { AssessmentModel } from "../../../models/v1/assessment.model.js";
import Mailer from "../services/mail.service.js";
import Template from "../services/template.service.js";
export const v1CreatorsRouter = express.Router();
// ROUTER MIDDLEWARES
v1CreatorsRouter.use(passport.initialize());
// v1CreatorsRouter.use(serializeDeserializeUser);
// ROUTE HANDLERS (AUTH)
v1CreatorsRouter.post("/auth/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const creatorAuthPayload = req.body;
        const { user } = req;
        const { email, firstName, lastName, password } = creatorAuthPayload;
        const verificationID = jwt.sign({ uuid: randomUUID() }, v1Config.authOptions.jwtSecret, { expiresIn: '24h' });
        const pendingCreator = new CreatorModel(email, password, firstName, lastName, undefined, undefined, verificationID);
        const userID = yield pendingCreator.save();
        const messageEmail = new Template({ type: "verificationLink", data: { verificationLink: `${v1Config.serverOptions.clientURL}/auth?verification_id=${verificationID}&user_id=${userID}` } }).generate;
        Mailer.sendEmail(v1Config.serviceOptions.platformEmail, { html: messageEmail, subject: "verification link from courseta", text: "Hi, below is your verification link:", to: email });
        const resPayload = Object.assign({ message: "user registered successfully!" }, (() => (user ? { user } : null))());
        return res.status(201).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v1CreatorsRouter.post("/auth/login", passport.authenticate("creators_local"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        const resPayload = Object.assign({ message: "user authenticated successfully!" }, (() => (user ? { user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v1CreatorsRouter.use(creatorsLocalProtected);
// ROUTE HANDLERS (PROTECTED)
v1CreatorsRouter.get("/:creator_id/courses", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const creatorID = req.params.creator_id;
    try {
        const { user } = req;
        const resCourses = yield CourseModel.all({
            variant: "creator",
            creatorID,
        });
        const resPayload = Object.assign({ payload: resCourses, message: null }, (() => (user ? { user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v1CreatorsRouter.get("/:creator_id/courses/top", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        const { creator_id: creatorID } = req.params;
        const resCourses = yield CourseModel.getTopCoursesFor(creatorID);
        const resPayload = Object.assign({ payload: resCourses, message: null }, (() => (user ? { user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v1CreatorsRouter.get("/:creator_id/courses/:course_id/edit", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        const { course_id: courseID } = req.params;
        const resData = yield CourseModel.fetchForEdit(+courseID);
        const resPayload = Object.assign({ message: null, payload: resData }, (() => (user ? { user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v1CreatorsRouter.get("/:creator_id/courses/:course_id/lessons/edit", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { course_id: courseID } = req.params;
        const { user } = req;
        const resData = yield CourseModel.getLessonsFor(+courseID, "edit");
        const resPayload = Object.assign({ message: null, payload: resData }, (() => (user ? { user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v1CreatorsRouter.get("/:creator_id/assessments/:assessment_id/edit", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assessment_id: assessmentID } = req.params;
        const { user } = req;
        const resData = yield AssessmentModel.fetchForCourseEdit(assessmentID);
        const resPayload = Object.assign({ message: null, payload: resData }, (() => (user ? { user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v1CreatorsRouter.get("/:creator_id/courses/:course_id/exam/edit", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { course_id: courseID } = req.params;
        const { user } = req;
        const resData = yield ExamModel.fetchForEdit(+courseID);
        const resPayload = Object.assign({ message: null, payload: resData }, (() => (user ? { user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v1CreatorsRouter.get("/:creator_id/me", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const creatorEmail = req.user.email;
        const resCreator = yield CreatorModel.getProfile(creatorEmail);
        const resPayload = {
            payload: resCreator,
            message: null,
        };
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v1CreatorsRouter.put("/:creator_id/courses/:course_id", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const creatorID = req.params.creator_id;
        const courseID = req.params.course_id;
        const courseEditPayload = req.body;
        const courseTitle = (_a = courseEditPayload.info) === null || _a === void 0 ? void 0 : _a.title;
        const courseDescription = (_b = courseEditPayload.info) === null || _b === void 0 ? void 0 : _b.description;
        const [courseImage, courseThumbnail] = courseEditPayload.images;
        const tags = (_c = courseEditPayload.info) === null || _c === void 0 ? void 0 : _c.tags;
        const resultCourse = yield CourseModel.updateFields(+courseID, courseThumbnail, courseDescription, tags, randomUUID(), courseTitle, courseImage);
        const resPayload = Object.assign({ payload: resultCourse, message: "course update success!" }, (() => (req.user ? { user: req.user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v1CreatorsRouter.put("/:creator_id/me", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const creatorID = req.params.creator_id;
        const updatePayload = Object.assign(Object.assign({}, req.body), { userID: creatorID });
        try {
            yield UserModel.updateFields(updatePayload, "creator");
        }
        catch (err) {
            throw new ServerError(`could not update fields, check inputs and try again!`, 400);
        }
        const resPayload = Object.assign({ message: "success!" }, (() => (req.user ? { user: req.user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v1CreatorsRouter.put("/:creator_id/assessments/:assessment_id", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assessment_id: assessmentID } = req.params;
        const assessmentUpdatePayload = req.body;
        const { answerDataList, questionDataList, trashQuestionIDList, parentEntityID, } = assessmentUpdatePayload;
        for (let i = 0; i < questionDataList.length; i++) {
            const entryQuestion = questionDataList[i];
            const { points, positionID, questionText } = entryQuestion;
            const pendingQuestion = new QuestionModel(questionText, points, positionID, assessmentID, undefined, undefined, parentEntityID);
            for (let j = 0; j < answerDataList.length; j++) {
                const entryAnswer = answerDataList[j];
                const { answerText, isCorrect, questionPositionID } = entryAnswer;
                if (questionPositionID === positionID) {
                    const pendingAnswer = new AnswerModel(answerText, isCorrect, questionPositionID);
                    pendingQuestion.answersData = pendingAnswer;
                }
            }
            pendingQuestion.save();
        }
        for (let k = 0; k < trashQuestionIDList.length; k++) {
            QuestionModel.trashData(trashQuestionIDList[k]);
        }
        yield QuestionModel.saveAll();
        const resPayload = Object.assign({ message: "success!" }, (() => (req.user ? { user: req.user } : null))());
        res.status(201).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v1CreatorsRouter.post("/:creator_id/courses/:course_id/lessons/", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const creatorID = req.params.creator_id;
        const courseID = req.params.course_id;
        const lessonAdditionpayload = req.body;
        for (let i = 0; i < lessonAdditionpayload.lessonData.length; i++) {
            const lessonEl = lessonAdditionpayload.lessonData[i];
            const pendingLesson = new LessonModel(lessonEl.title, lessonEl.positionID, +courseID);
            for (let j = 0; j < lessonAdditionpayload.lessonContentData.length; j++) {
                const contentEl = lessonAdditionpayload.lessonContentData[j];
                const { contentType, duration, href, lessonPositionID, title } = contentEl;
                if (contentEl.lessonPositionID === lessonEl.positionID) {
                    const pendingLessonContent = new LessonContentModel(title, href, contentType, duration, lessonEl.positionID);
                    pendingLesson.lessonContentData = pendingLessonContent;
                }
            }
            for (let k = 0; k < lessonAdditionpayload.lessonQuizData.length; k++) {
                const quizEl = lessonAdditionpayload.lessonQuizData[k];
                const { description, lessonPositionID, passScore, quizTitle } = quizEl;
                if (quizEl.lessonPositionID === lessonEl.positionID) {
                    const pendingQuiz = new QuizModel(quizTitle, description, passScore, lessonPositionID);
                    pendingLesson.lessonQuizData = pendingQuiz;
                }
            }
            pendingLesson.save();
        }
        yield LessonModel.saveAll();
        const resPayload = Object.assign({ message: "success!" }, (() => (req.user ? { user: req.user } : null))());
        return res.status(201).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v1CreatorsRouter.post("/:creator_id/courses/:course_id/lessons/:lesson_id/quizzes", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lesson_id: lessonID } = req.params;
        const quizCreationPayload = req.body;
        const { quizTitle, description, passScore } = quizCreationPayload;
        const pendingLesson = new LessonModel("", undefined, undefined, undefined, +lessonID);
        const resID = yield pendingLesson.addQuiz(quizTitle, description || "", passScore || 0);
        const resPayload = Object.assign({ payload: resID, message: "quiz creation success!" }, (() => (req.user ? { user: req.user } : null))());
        res.status(201).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v1CreatorsRouter.post("/:creator_id/courses/:course_id/exams/", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { course_id: courseID } = req.params;
        const examCreationPayload = req.body;
        const { description, duration, startDate, endDate, passScore } = examCreationPayload;
        const currDate = new Date().toISOString();
        const pendingExam = new ExamModel(+courseID, passScore || 0, description || "", duration || 0, startDate || currDate, endDate || currDate); // TODO: make sure that these are passed using validation. do not help the client
        const examID = yield pendingExam.save();
        const resPayload = Object.assign({ payload: examID, message: "exam creation success!" }, (() => (req.user ? { user: req.user } : null))());
        res.status(201).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v1CreatorsRouter.post("/:creator_id/courses/:course_id/lessons/:lesson_id/contents", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lesson_id: lessonID } = req.params;
        const contentCreationPayload = req.body;
        const { contentType, duration, href, title } = contentCreationPayload;
        const pendingLesson = new LessonModel("", undefined, undefined, undefined, +lessonID);
        const resID = yield pendingLesson.addContent(title || "", href || "", duration || 0, contentType);
        const resPayload = Object.assign({ payload: resID, message: "content created successfully!" }, (() => (req.user ? { user: req.user } : null))());
        res.status(201).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v1CreatorsRouter.post("/:creator_id/courses", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const creatorID = req.params.creator_id;
        const courseCreationPayload = req.body;
        const courseTitle = (_a = courseCreationPayload.info) === null || _a === void 0 ? void 0 : _a.title;
        const courseDescription = (_b = courseCreationPayload.info) === null || _b === void 0 ? void 0 : _b.description;
        const [courseThumbnail, courseImage] = courseCreationPayload.images;
        const tags = (_c = courseCreationPayload.info) === null || _c === void 0 ? void 0 : _c.tags;
        const generatedImageID = randomUUID();
        const pendingCourse = new CourseModel(courseTitle || "", courseDescription || "", courseThumbnail, creatorID, tags, undefined, undefined, undefined, generatedImageID);
        let imageUploadRequest = null;
        const imageUploadpayload = {
            id: generatedImageID,
            imageUrl: courseImage,
        };
        if (!!courseImage)
            imageUploadRequest = yield fetch(`${v1Config.serverOptions.imageServerBaseUrl}/api/v1/images`, {
                headers: {
                    "Content-Type": "application/json",
                    Cookie: "",
                },
                method: "post",
                body: JSON.stringify(imageUploadpayload),
            });
        if (!imageUploadRequest ||
            (imageUploadRequest && imageUploadRequest.ok)) {
            const courseID = yield pendingCourse.save(creatorID);
            const resPayload = Object.assign({ payload: courseID, message: "course creation success!" }, (() => (req.user ? { user: req.user } : null))());
            return res.status(201).json(resPayload);
        }
        else {
            if (imageUploadRequest.status - 400 < 99 &&
                imageUploadRequest.status >= 400)
                throw new ServerError("could not upload image!. check inputs ", 400);
            else
                throw new ServerError("something went wrong uploading the image. please try again.", imageUploadRequest.status);
        }
    }
    catch (err) {
        next(err);
    }
}));
v1CreatorsRouter.post("/:creator_id/logout", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
v1CreatorsRouter.post("/pass/:creator_id/new", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { creator_id: creatorID } = req.params;
        const resultPass = yield CreatorModel.requestPass(creatorID);
        const resPayload = Object.assign({ payload: resultPass, message: "creator pass update success!" }, (() => (req.user ? { user: req.user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v1CreatorsRouter.post("/:creator_id/courses/:course_id/archive", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { creator_id: creatorID, course_id: courseID } = req.params;
        yield CourseModel.archive(+courseID, creatorID);
        const resPayload = Object.assign({ message: "course archived successfully!" }, (() => (req.user ? { user: req.user } : null))());
        return res.status(204).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v1CreatorsRouter.post("/:creator_id/courses/:course_id/unarchive", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { creator_id: creatorID, course_id: courseID } = req.params;
        yield CourseModel.unarchive(+courseID, creatorID);
        const resPayload = Object.assign({ message: "course unarchived successfully!" }, (() => (req.user ? { user: req.user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v1CreatorsRouter.delete("/:creator_id/courses/:course_id/exams/:exam_id/", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { course_id: courseID } = req.params;
        yield ExamModel.delete(+courseID);
        const resPayload = Object.assign({ message: "exam deleted successfully!" }, (() => (req.user ? { user: req.user } : null))());
        return res.status(204).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v1CreatorsRouter.delete("/:creator_id/courses/:course_id/lessons/:lesson_id/quizzes/:quiz_id", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lesson_id: lessonID } = req.params;
        yield QuizModel.delete(+lessonID);
        const resPayload = Object.assign({ message: "quiz deleted successfully!" }, (() => (req.user ? { user: req.user } : null))());
        return res.status(204).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v1CreatorsRouter.delete("/:creator_id/courses/:course_id/lessons/:lesson_id/contents/:content_id", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lesson_id: lessonID, content_id: contentID } = req.params;
        yield LessonContentModel.delete(+lessonID, +contentID);
        const resPayload = Object.assign({ message: "content deleted successfully!" }, (() => (req.user ? { user: req.user } : null))());
        return res.status(204).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v1CreatorsRouter.delete("/:creator_id/courses/:course_id", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { creator_id: creatorID, course_id: courseID } = req.params;
        yield CourseModel.delete(+courseID, creatorID);
        const resPayload = Object.assign({ message: "course deleted successfully!" }, (() => (req.user ? { user: req.user } : null))());
        return res.status(204).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v1CreatorsRouter.delete("/:creator_id/courses/:course_id/lessons/:lesson_id", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lesson_id: lessonID } = req.params;
        yield LessonModel.delete(+lessonID);
        const resPayload = Object.assign({ message: "lesson deleted successfully!" }, (() => (req.user ? { user: req.user } : null))());
        return res.status(204).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
