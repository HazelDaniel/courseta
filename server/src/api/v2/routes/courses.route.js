var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CourseModel } from "../../../models/v1/course.model.js";
import express from "express";
import { ReviewModel } from "../../../models/v1/review.model.js";
import { EnrollmentModel } from "../../../models/v1/enrollment.model.js";
import { ExamModel } from "../../../models/v1/exam.model.js";
import { QuizModel } from "../../../models/v1/quiz.model.js";
import { LessonModel } from "../../../models/v1/lesson.model.js";
import passport from "passport";
import { serializeDeserializeUser } from "../middlewares/auth.middleware.js";
export const v2CoursesRouter = express.Router();
v2CoursesRouter.use(passport.initialize());
v2CoursesRouter.use(serializeDeserializeUser);
v2CoursesRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resCourses = yield CourseModel.all();
        const { user } = req;
        const resPayload = Object.assign({ payload: resCourses, message: null }, (() => (user ? { user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.get("/:course_id/reviews", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { course_id: courseID } = req.params;
        const { user } = req;
        const resReviews = yield CourseModel.getReviewsFor(+courseID);
        const resPayload = Object.assign({ payload: resReviews, message: null }, (() => (user ? { user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.get("/:course_id/creator/summary", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { course_id: courseID } = req.params;
        const { user } = req;
        const resCreator = yield CourseModel.getCreatorFor(+courseID);
        const resPayload = Object.assign({ payload: resCreator, message: null }, (() => (user ? { user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.get("/:course_id/lessons", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { course_id: courseID } = req.params;
        const { user } = req;
        const resLessons = yield CourseModel.getLessonsFor(+courseID, "read");
        const resPayload = Object.assign({ payload: resLessons, message: null }, (() => (user ? { user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.get("/:course_id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { course_id: courseID } = req.params;
        const { user } = req;
        const resCoursePromise = CourseModel.search(+courseID);
        const studentEnrollmentStatus = EnrollmentModel.confirmEnrollment(((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || "", courseID);
        const resPromises = yield Promise.all([
            resCoursePromise,
            studentEnrollmentStatus,
        ]);
        const status = resPromises[1];
        const resPayload = Object.assign({ payload: Object.assign(Object.assign({}, resPromises[0].detail), { isEnrolled: status }), message: null }, (() => (user ? { user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.get("/:course_id/exams/:exam_id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { exam_id: assessmentID } = req.params;
        const { user } = req;
        const resultAssessment = yield ExamModel.search(assessmentID, "edit");
        const resPayload = Object.assign({ payload: resultAssessment, message: null }, (() => (user ? { user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.get("/:course_id/lessons/:lesson_id/quizzes/:quiz_id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quiz_id: assessmentID } = req.params;
        const { user } = req;
        const resultAssessment = yield QuizModel.search(assessmentID);
        const resPayload = Object.assign({ payload: resultAssessment, message: null }, (() => (user ? { user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.get("/:course_id/lessons/:lesson_id/contents/:content_id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lesson_id: lessonID } = req.params;
        const { user } = req;
        const resultContents = yield LessonModel.getContentsFor(+lessonID);
        const resPayload = Object.assign({ payload: resultContents, message: null }, (() => (user ? { user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.post("/:course_id/reviews", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { course_id: courseID } = req.params;
        const { user } = req;
        const reviewPayload = req.body;
        const { rating, reviewText, studentID } = reviewPayload;
        const newReview = new ReviewModel(studentID, courseID, rating, reviewText);
        yield newReview.save();
        const resPayload = Object.assign({ payload: null, message: "course reviewed successfully!" }, (() => (user ? { user } : null))());
        return res.status(201).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.post("/:course_id/enroll", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { course_id: courseID } = req.params;
        const { user } = req;
        const reviewPayload = req.body;
        const { studentID } = reviewPayload;
        const enrollment = new EnrollmentModel(studentID, courseID);
        yield enrollment.save();
        const resPayload = Object.assign({ payload: null, message: "student enrolled successfully!" }, (() => (user ? { user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.post("/:course_id/unenroll", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { course_id: courseID } = req.params;
        const { user } = req;
        const reviewPayload = req.body;
        const { studentID } = reviewPayload;
        const enrollment = yield EnrollmentModel.delete(studentID, courseID);
        const resPayload = Object.assign({ payload: null, message: "student unenrolled successfully!" }, (() => (user ? { user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
