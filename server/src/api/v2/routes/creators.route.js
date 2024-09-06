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
import { creatorIDProtected, creatorsLocalProtected, } from "../middlewares/auth.middleware.js";
import { signUp } from "../controllers/creators/sign-up.js";
import { signIn } from "../controllers/creators/sign-in.js";
import { getCreatorCourses } from "../controllers/creators/get-creator-courses.js";
import { getCreatorTopCourses } from "../controllers/creators/get-creator-top-courses.js";
import { getCourseForEdit } from "../controllers/creators/get-course-for-edit.js";
import { getLessonsForEdit } from "../controllers/creators/get-lessons-for-edit.js";
import { getAssessmentForEdit } from "../controllers/creators/get-assessment-for-edit.js";
import { getExamForEdit } from "../controllers/creators/get-exam-for-edit.js";
import { getProfile } from "../controllers/creators/get-profile.js";
import { updateCourse } from "../controllers/creators/update-course.js";
import { updateProfile } from "../controllers/creators/update-profile.js";
import { updateAssessment } from "../controllers/creators/update-assessment.js";
import { createLesson } from "../controllers/creators/create-lesson.js";
import { createQuiz } from "../controllers/creators/create-quiz.js";
import { createExam } from "../controllers/creators/create-exam.js";
import { createContent } from "./../controllers/creators/create-content.js";
import { createCourse } from "./../controllers/creators/create-course.js";
import { requestPass } from "../controllers/creators/request-pass.js";
import { archiveCourse } from "./../controllers/creators/archive-course.js";
import { unarchiveCourse } from "../controllers/creators/unarchive-course.js";
import { deleteExam } from "../controllers/creators/delete-exam.js";
import { deleteQuiz } from "../controllers/creators/delete-quiz.js";
import { deleteContent } from "../controllers/creators/delete-content.js";
import { deleteCourse } from "../controllers/creators/delete-course.js";
import { deleteLesson } from "../controllers/creators/delete-lesson.js";
export const v2CreatorsRouter = express.Router();
// ROUTER MIDDLEWARES
v2CreatorsRouter.use(passport.initialize());
// v2CreatorsRouter.use(serializeDeserializeUser);
// ROUTE HANDLERS (AUTH)
v2CreatorsRouter.post("/auth/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield signUp(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CreatorsRouter.post("/auth/login", passport.authenticate("creators_local"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield signIn(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CreatorsRouter.use(creatorsLocalProtected);
// ROUTE HANDLERS (PROTECTED)
v2CreatorsRouter.get("/:creator_id/courses", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield getCreatorCourses(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CreatorsRouter.get("/:creator_id/courses/top", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield getCreatorTopCourses(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CreatorsRouter.get("/:creator_id/courses/:course_id/edit", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield getCourseForEdit(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CreatorsRouter.get("/:creator_id/courses/:course_id/lessons/edit", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield getLessonsForEdit(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CreatorsRouter.get("/:creator_id/assessments/:assessment_id/edit", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield getAssessmentForEdit(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CreatorsRouter.get("/:creator_id/courses/:course_id/exam/edit", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield getExamForEdit(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CreatorsRouter.get("/:creator_id/me", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield getProfile(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CreatorsRouter.put("/:creator_id/courses/:course_id", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield updateCourse(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CreatorsRouter.put("/:creator_id/me", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield updateProfile(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CreatorsRouter.put("/:creator_id/assessments/:assessment_id", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield updateAssessment(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CreatorsRouter.post("/:creator_id/courses/:course_id/lessons/", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield createLesson(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CreatorsRouter.post("/:creator_id/courses/:course_id/lessons/:lesson_id/quizzes", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield createQuiz(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CreatorsRouter.post("/:creator_id/courses/:course_id/exams/", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield createExam(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CreatorsRouter.post("/:creator_id/courses/:course_id/lessons/:lesson_id/contents", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield createContent(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CreatorsRouter.post("/:creator_id/courses", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield createCourse(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CreatorsRouter.post("/:creator_id/logout", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
v2CreatorsRouter.post("/pass/:creator_id/new", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield requestPass(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CreatorsRouter.post("/:creator_id/courses/:course_id/archive", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield archiveCourse(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CreatorsRouter.post("/:creator_id/courses/:course_id/unarchive", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield unarchiveCourse(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CreatorsRouter.delete("/:creator_id/courses/:course_id/exams/:exam_id/", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield deleteExam(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CreatorsRouter.delete("/:creator_id/courses/:course_id/lessons/:lesson_id/quizzes/:quiz_id", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield deleteQuiz(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CreatorsRouter.delete("/:creator_id/courses/:course_id/lessons/:lesson_id/contents/:content_id", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield deleteContent(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CreatorsRouter.delete("/:creator_id/courses/:course_id", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield deleteCourse(req, res);
    }
    catch (err) {
        next(err);
    }
}));
v2CreatorsRouter.delete("/:creator_id/courses/:course_id/lessons/:lesson_id", creatorIDProtected, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield deleteLesson(req, res);
    }
    catch (err) {
        next(err);
    }
}));
