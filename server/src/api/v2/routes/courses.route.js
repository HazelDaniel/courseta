var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import passport from "passport";
import { serializeDeserializeUser } from "../middlewares/auth.middleware.js";
// CONTROLLERS
import { getAllCourses } from "../controllers/courses/get-all-courses.js";
import { getCourseReviews } from "./../controllers/courses/get-course-reviews.js";
import { getCourseCreatorSummary } from "../controllers/courses/get-course-creator-summary.js";
import { getCourseLessons } from "../controllers/courses/get-course-lessons.js";
import { getCourse } from "../controllers/courses/get-course.js";
import { getCourseExam } from "../controllers/courses/get-course-exam.js";
import { getCourseLessonQuiz } from "./../controllers/courses/get-course-lesson-quiz.js";
import { getCourseLessonContent } from "../controllers/courses/get-course-lesson-content.js";
import { setCourseReview } from "../controllers/courses/set-course-review.js";
import { enrollCourse } from "../controllers/courses/enroll-course.js";
import { unenrollCourse } from "../controllers/courses/unenroll-course.js";
export const v2CoursesRouter = express.Router();
v2CoursesRouter.use(passport.initialize());
v2CoursesRouter.use(serializeDeserializeUser);
// ROUTE HANDLERS
v2CoursesRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield getAllCourses(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.get("/:course_id/reviews", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield getCourseReviews(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.get("/:course_id/creator/summary", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield getCourseCreatorSummary(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.get("/:course_id/lessons", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield getCourseLessons(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.get("/:course_id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield getCourse(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.get("/:course_id/exams/:exam_id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield getCourseExam(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.get("/:course_id/lessons/:lesson_id/quizzes/:quiz_id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield getCourseLessonQuiz(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.get("/:course_id/lessons/:lesson_id/contents/:content_id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield getCourseLessonContent(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.post("/:course_id/reviews", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield setCourseReview(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.post("/:course_id/enroll", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield enrollCourse(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.post("/:course_id/unenroll", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield unenrollCourse(req, res);
    }
    catch (err) {
        next(err);
    }
}));
