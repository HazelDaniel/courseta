import { CourseModel } from "../../../models/v1/course.model.js";
import express from "express";
import type { CourseDetailViewType, ServerPayloadType, SessionUserType } from "../../../types";
import { ReviewModel } from "../../../models/v1/review.model.js";
import { StudentEnrollPayloadType, StudentReviewPayloadType } from "../../../client.types.js";
import { EnrollmentModel } from "../../../models/v1/enrollment.model.js";
import { ExamModel } from "../../../models/v1/exam.model.js";
import { QuizModel } from "../../../models/v1/quiz.model.js";
import { LessonModel } from "../../../models/v1/lesson.model.js";
import passport from "passport";
import { serializeDeserializeUser } from "../middlewares/auth.middleware.js";
export const v1CoursesRouter = express.Router();

v1CoursesRouter.use(passport.initialize());
v1CoursesRouter.use(serializeDeserializeUser);

v1CoursesRouter.get("/", async (req, res, next) => {
  try {
    const resCourses = await CourseModel.all();
    const { user } = req;
    const resPayload: ServerPayloadType<typeof resCourses> = {
      payload: resCourses,
      message: null,
      ...(() => (user ? ({ user } as Express.User) : null))(),
    };
    return res.status(200).json(resPayload);
  } catch (err) {
    next(err);
  }
});

v1CoursesRouter.get("/:course_id/reviews", async (req, res, next) => {
  try {
    const { course_id: courseID } = req.params;
    const { user } = req;
    const resReviews = await CourseModel.getReviewsFor(+courseID);
    const resPayload: ServerPayloadType<typeof resReviews> = {
      payload: resReviews,
      message: null,
      ...(() => (user ? ({ user } as Express.User) : null))(),
    };
    return res.status(200).json(resPayload);
  } catch (err) {
    next(err);
  }
});

v1CoursesRouter.get("/:course_id/creator/summary", async (req, res, next) => {
  try {
    const { course_id: courseID } = req.params;
    const { user } = req;
    const resCreator = await CourseModel.getCreatorFor(+courseID);
    const resPayload: ServerPayloadType<typeof resCreator> = {
      payload: resCreator,
      message: null,
      ...(() => (user ? ({ user } as Express.User) : null))(),
    };
    return res.status(200).json(resPayload);
  } catch (err) {
    next(err);
  }
});

v1CoursesRouter.get("/:course_id/lessons", async (req, res, next) => {
  try {
    const { course_id: courseID } = req.params;
    const { user } = req;
    const resLessons = await CourseModel.getLessonsFor(+courseID, "read");
    const resPayload: ServerPayloadType<typeof resLessons> = {
      payload: resLessons,
      message: null,
      ...(() => (user ? ({ user } as Express.User) : null))(),
    };
    return res.status(200).json(resPayload);
  } catch (err) {
    next(err);
  }
});

v1CoursesRouter.get("/:course_id", async (req, res, next) => {
  try {
    const { course_id: courseID } = req.params;
    const { user } = req;
    const resCoursePromise =  CourseModel.search(+courseID);
    const studentEnrollmentStatus = EnrollmentModel.confirmEnrollment((req.user as SessionUserType)?.id || "", courseID);
    const resPromises = await Promise.all([resCoursePromise, studentEnrollmentStatus])
    const status: boolean = resPromises[1];

    const resPayload: ServerPayloadType<(typeof resPromises[0])["detail"]> = {
      payload: {...resPromises[0].detail, isEnrolled: status } as CourseDetailViewType,
      message: null,
      ...(() => (user ? ({ user } as Express.User) : null))(),
    };
    return res.status(200).json(resPayload);
  } catch (err) {
    next(err);
  }
});

v1CoursesRouter.get("/:course_id/exams/:exam_id", async (req, res, next) => {
  try {
    const { exam_id: assessmentID } = req.params;
    const { user } = req;
    const resultAssessment = await ExamModel.search(assessmentID, "edit");
    const resPayload: ServerPayloadType<typeof resultAssessment> = {
      payload: resultAssessment,
      message: null,
      ...(() => (user ? ({ user } as Express.User) : null))(),
    };
    return res.status(200).json(resPayload);
  } catch (err) {
    next(err);
  }
});

v1CoursesRouter.get(
  "/:course_id/lessons/:lesson_id/quizzes/:quiz_id",
  async (req, res, next) => {
    try {
      const { quiz_id: assessmentID } = req.params;
      const { user } = req;
      const resultAssessment = await QuizModel.search(assessmentID);
      const resPayload: ServerPayloadType<typeof resultAssessment> = {
        payload: resultAssessment,
        message: null,
        ...(() => (user ? ({ user } as Express.User) : null))(),
      };
      return res.status(200).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CoursesRouter.get(
  "/:course_id/lessons/:lesson_id/contents/:content_id",
  async (req, res, next) => {
    try {
      const { lesson_id: lessonID } = req.params;
      const { user } = req;
      const resultContents = await LessonModel.getContentsFor(+lessonID);
      const resPayload: ServerPayloadType<typeof resultContents> = {
        payload: resultContents,
        message: null,
        ...(() => (user ? ({ user } as Express.User) : null))(),
      };
      return res.status(200).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CoursesRouter.post("/:course_id/reviews", async (req, res, next) => {
  try {
    const { course_id: courseID } = req.params;
    const { user } = req;
    const reviewPayload: StudentReviewPayloadType =
      req.body as StudentReviewPayloadType;
    const { rating, reviewText, studentID } = reviewPayload;
    const newReview = new ReviewModel(
      studentID as string,
      courseID,
      rating,
      reviewText
    );
    await newReview.save();
    const resPayload: ServerPayloadType<null> = {
      payload: null,
      message: "course reviewed successfully!",
      ...(() => (user ? ({ user } as Express.User) : null))(),
    };
    return res.status(201).json(resPayload);
  } catch (err) {
    next(err);
  }
});

v1CoursesRouter.post("/:course_id/enroll", async (req, res, next) => {
  try {
    const { course_id: courseID } = req.params;
    const { user } = req;
    const reviewPayload: StudentEnrollPayloadType =
      req.body as StudentEnrollPayloadType;
    const { studentID } = reviewPayload;
    const enrollment = new EnrollmentModel(studentID as string, courseID);
    await enrollment.save();
    const resPayload: ServerPayloadType<null> = {
      payload: null,
      message: "student enrolled successfully!",
      ...(() => (user ? ({ user } as Express.User) : null))(),
    };
    return res.status(200).json(resPayload);
  } catch (err) {
    next(err);
  }
});


v1CoursesRouter.post("/:course_id/unenroll", async (req, res, next) => {
  try {
    const { course_id: courseID } = req.params;
    const { user } = req;
    const reviewPayload: StudentEnrollPayloadType =
      req.body as StudentEnrollPayloadType;
    const { studentID } = reviewPayload;
    const enrollment = await EnrollmentModel.delete(studentID as string, courseID);
    const resPayload: ServerPayloadType<null> = {
      payload: null,
      message: "student unenrolled successfully!",
      ...(() => (user ? ({ user } as Express.User) : null))(),
    };
    return res.status(200).json(resPayload);
  } catch (err) {
    next(err);
  }
});