import { Request, Response } from "express";
import type { ServerPayloadType } from "../../../../types";
import type { StudentReviewPayloadType } from "../../../../client.types";
import { ReviewModel } from "../../../../models/v1/review.model.js";

export const setCourseReview = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
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
};
