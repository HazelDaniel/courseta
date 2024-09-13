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
import GlobalRouteCache from "express-pubsubcache";
export const v2CoursesRouter = express.Router();
v2CoursesRouter.use(passport.initialize());
v2CoursesRouter.use(serializeDeserializeUser);
// ROUTE HANDLERS
v2CoursesRouter.get("/", GlobalRouteCache.createCacheSubscriber(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (res.locals.cachedResponse) {
            return res
                .status(res.locals.cachedResponse.statusCode)
                .set(res.locals.cachedResponse.headers)
                .send(res.locals.cachedResponse.body);
        }
        return yield getAllCourses(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.get("/:course_id/reviews", GlobalRouteCache.createCacheSubscriber(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (res.locals.cachedResponse) {
            return res
                .status(res.locals.cachedResponse.statusCode)
                .set(res.locals.cachedResponse.headers)
                .send(res.locals.cachedResponse.body);
        }
        return yield getCourseReviews(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.get("/:course_id/creator/summary", GlobalRouteCache.createCacheSubscriber(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (res.locals.cachedResponse) {
            return res
                .status(res.locals.cachedResponse.statusCode)
                .set(res.locals.cachedResponse.headers)
                .send(res.locals.cachedResponse.body);
        }
        return yield getCourseCreatorSummary(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.get("/:course_id/lessons", GlobalRouteCache.createCacheSubscriber(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (res.locals.cachedResponse) {
            return res
                .status(res.locals.cachedResponse.statusCode)
                .set(res.locals.cachedResponse.headers)
                .send(res.locals.cachedResponse.body);
        }
        return yield getCourseLessons(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.get("/:course_id", GlobalRouteCache.createCacheSubscriber(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (res.locals.cachedResponse) {
            return res
                .status(res.locals.cachedResponse.statusCode)
                .set(res.locals.cachedResponse.headers)
                .send(res.locals.cachedResponse.body);
        }
        return yield getCourse(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.get("/:course_id/exams/:exam_id", GlobalRouteCache.createCacheSubscriber(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (res.locals.cachedResponse) {
            return res
                .status(res.locals.cachedResponse.statusCode)
                .set(res.locals.cachedResponse.headers)
                .send(res.locals.cachedResponse.body);
        }
        return yield getCourseExam(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.get("/:course_id/lessons/:lesson_id/quizzes/:quiz_id", GlobalRouteCache.createCacheSubscriber(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (res.locals.cachedResponse) {
            return res
                .status(res.locals.cachedResponse.statusCode)
                .set(res.locals.cachedResponse.headers)
                .send(res.locals.cachedResponse.body);
        }
        return yield getCourseLessonQuiz(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.get("/:course_id/lessons/:lesson_id/contents/:content_id", GlobalRouteCache.createCacheSubscriber(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (res.locals.cachedResponse) {
            return res
                .status(res.locals.cachedResponse.statusCode)
                .set(res.locals.cachedResponse.headers)
                .send(res.locals.cachedResponse.body);
        }
        return yield getCourseLessonContent(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.post("/:course_id/reviews", GlobalRouteCache.createCachePublisher(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield setCourseReview(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.post("/:course_id/enroll", GlobalRouteCache.createCachePublisher(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield enrollCourse(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CoursesRouter.post("/:course_id/unenroll", GlobalRouteCache.createCachePublisher(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield unenrollCourse(req, res);
    }
    catch (err) {
        next(err);
    }
}));
