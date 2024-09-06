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
v2CoursesRouter.get("/", async (req, res, next) => {
  try {
    return await getAllCourses(req, res);
  } catch (err) {
    next(err);
  }
});

v2CoursesRouter.get("/:course_id/reviews", async (req, res, next) => {
  try {
    return await getCourseReviews(req, res);
  } catch (err) {
    next(err);
  }
});

v2CoursesRouter.get("/:course_id/creator/summary", async (req, res, next) => {
  try {
    return await getCourseCreatorSummary(req, res);
  } catch (err) {
    next(err);
  }
});

v2CoursesRouter.get("/:course_id/lessons", async (req, res, next) => {
  try {
    return await getCourseLessons(req, res);
  } catch (err) {
    next(err);
  }
});

v2CoursesRouter.get("/:course_id", async (req, res, next) => {
  try {
    return await getCourse(req, res);
  } catch (err) {
    next(err);
  }
});

v2CoursesRouter.get("/:course_id/exams/:exam_id", async (req, res, next) => {
  try {
    return await getCourseExam(req, res);
  } catch (err) {
    next(err);
  }
});

v2CoursesRouter.get(
  "/:course_id/lessons/:lesson_id/quizzes/:quiz_id",
  async (req, res, next) => {
    try {
      return await getCourseLessonQuiz(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CoursesRouter.get(
  "/:course_id/lessons/:lesson_id/contents/:content_id",
  async (req, res, next) => {
    try {
      return await getCourseLessonContent(req, res);
    } catch (err) {
      next(err);
    }
  }
);

v2CoursesRouter.post("/:course_id/reviews", async (req, res, next) => {
  try {
    return await setCourseReview(req, res);
  } catch (err) {
    next(err);
  }
});

v2CoursesRouter.post("/:course_id/enroll", async (req, res, next) => {
  try {
    return await enrollCourse(req, res);
  } catch (err) {
    next(err);
  }
});

v2CoursesRouter.post("/:course_id/unenroll", async (req, res, next) => {
  try {
    return await unenrollCourse(req, res);
  } catch (err) {
    next(err);
  }
});
