import express from "express";
import passport from "passport";
import {
  creatorIDProtected,
  creatorsLocalProtected,
} from "../middlewares/auth.middleware.js";

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
v2CreatorsRouter.post("/auth/signup", async (req, res, next) => {
  try {
    return await signUp(req, res);
  } catch (err) {
    next(err);
  }
});

v2CreatorsRouter.post(
  "/auth/login",
  passport.authenticate("creators_local"),
  async (req, res, next) => {
    try {
      return await signIn(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CreatorsRouter.use(creatorsLocalProtected);

// ROUTE HANDLERS (PROTECTED)

v2CreatorsRouter.get(
  "/:creator_id/courses",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      return await getCreatorCourses(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CreatorsRouter.get(
  "/:creator_id/courses/top",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      return await getCreatorTopCourses(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CreatorsRouter.get(
  "/:creator_id/courses/:course_id/edit",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      return await getCourseForEdit(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CreatorsRouter.get(
  "/:creator_id/courses/:course_id/lessons/edit",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      return await getLessonsForEdit(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CreatorsRouter.get(
  "/:creator_id/assessments/:assessment_id/edit",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      return await getAssessmentForEdit(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CreatorsRouter.get(
  "/:creator_id/courses/:course_id/exam/edit",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      return await getExamForEdit(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CreatorsRouter.get(
  "/:creator_id/me",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      return await getProfile(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CreatorsRouter.put(
  "/:creator_id/courses/:course_id",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      return await updateCourse(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CreatorsRouter.put(
  "/:creator_id/me",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      return await updateProfile(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CreatorsRouter.put(
  "/:creator_id/assessments/:assessment_id",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      return await updateAssessment(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CreatorsRouter.post(
  "/:creator_id/courses/:course_id/lessons/",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      return await createLesson(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CreatorsRouter.post(
  "/:creator_id/courses/:course_id/lessons/:lesson_id/quizzes",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      return await createQuiz(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CreatorsRouter.post(
  "/:creator_id/courses/:course_id/exams/",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      return await createExam(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CreatorsRouter.post(
  "/:creator_id/courses/:course_id/lessons/:lesson_id/contents",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      return await createContent(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CreatorsRouter.post(
  "/:creator_id/courses",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      return await createCourse(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CreatorsRouter.post(
  "/:creator_id/logout",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      req.logOut((err) => {
        if (err) return next(err);
        return res.status(200).json();
      });
    } catch (err) {
      next(err);
    }
  }
);

v2CreatorsRouter.post(
  "/pass/:creator_id/new",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      return await requestPass(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CreatorsRouter.post(
  "/:creator_id/courses/:course_id/archive",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      return await archiveCourse(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CreatorsRouter.post(
  "/:creator_id/courses/:course_id/unarchive",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      return await unarchiveCourse(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CreatorsRouter.delete(
  "/:creator_id/courses/:course_id/exams/:exam_id/",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      return await deleteExam(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CreatorsRouter.delete(
  "/:creator_id/courses/:course_id/lessons/:lesson_id/quizzes/:quiz_id",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      return await deleteQuiz(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CreatorsRouter.delete(
  "/:creator_id/courses/:course_id/lessons/:lesson_id/contents/:content_id",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      return await deleteContent(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CreatorsRouter.delete(
  "/:creator_id/courses/:course_id",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      return await deleteCourse(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CreatorsRouter.delete(
  "/:creator_id/courses/:course_id/lessons/:lesson_id",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      return await deleteLesson(req, res);
    } catch (err) {
      next(err);
    }
  }
);
