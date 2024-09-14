var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ReviewModel } from "../../../../models/v1/review.model.js";
import { API_VERSION } from "../../config.js";
import GlobalRouteCache from "express-pubsubcache";
export const setCourseReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { course_id: courseID } = req.params;
    const { user } = req;
    const reviewPayload = req.body;
    const { rating, reviewText, studentID } = reviewPayload;
    const newReview = new ReviewModel(studentID, courseID, rating, reviewText);
    yield newReview.save();
    const resPayload = Object.assign({ payload: null, message: "course reviewed successfully!" }, (() => (user ? { user } : null))());
    res.status(201).json(resPayload);
    const affectedRoutes = [
        `/api/v${API_VERSION}/students/${studentID}/courses/recommended`,
        `/api/v${API_VERSION}/creators/:creator_id/me`,
        `/api/v${API_VERSION}/courses/:course_id/creator/summary`,
        `/api/v${API_VERSION}/courses/${courseID}`,
    ];
    for (const route of affectedRoutes) {
        GlobalRouteCache.pub(route);
    }
    return;
});
