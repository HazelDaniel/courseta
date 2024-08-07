import { CourseModel } from "../../../models/v1/course.model.js";
import express from "express";
import { ServerPayloadType } from "../../../types.js";
import { ReviewModel } from "../../../models/v1/review.model.js";
import { StudentReviewPayloadType } from "../../../client.types.js";
import { EnrollmentModel } from "../../../models/v1/enrollment.model.js";
export const v1CoursesRouter = express.Router();

v1CoursesRouter.get("/", async (req, res, next) => {
  try {
    const resCourses = await CourseModel.all();
    const resPayload: ServerPayloadType<typeof resCourses> = {
      payload: resCourses,
      message: null,
    };
    return res.status(200).json(resPayload);
  } catch (err) {
    next(err);
  }
});

v1CoursesRouter.post("/:course_id/reviews", async (req, res, next) => {
  try {
    const { course_id: courseID } = req.params;
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
    };
    return res.status(201).json(resPayload);
  } catch (err) {
    next(err);
  }
});

v1CoursesRouter.post("/:course_id/enroll", async (req, res, next) => {
  try {
    const { course_id: courseID } = req.params;
    const reviewPayload: StudentReviewPayloadType =
      req.body as StudentReviewPayloadType;
    const { rating, reviewText, studentID } = reviewPayload;
    const enrollment = new EnrollmentModel(
      studentID as string,
      courseID,
    );
    await enrollment.save();
    const resPayload: ServerPayloadType<null> = {
      payload: null,
      message: "student enrolled successfully!",
    };
    return res.status(201).json(resPayload);
  } catch (err) {
    next(err);
  }
});
