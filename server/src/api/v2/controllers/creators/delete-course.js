var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CourseModel } from "../../../../models/v1/course.model.js";
import GlobalRouteCache from "express-pubsubcache";
import { API_VERSION } from "../../config.js";
export const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { creator_id: creatorID, course_id: courseID } = req.params;
    yield CourseModel.delete(+courseID, creatorID);
    const resPayload = Object.assign({ message: "course deleted successfully!" }, (() => (req.user ? { user: req.user } : null))());
    res.status(204).json(resPayload);
    const affectedRoutes = [
        `/api/v${API_VERSION}/students/:student_id/courses/recommended`,
        `/api/v${API_VERSION}/students/:student_id/courses/unfinished`,
        `/api/v${API_VERSION}/students/:student_id/courses`,
        `/api/v${API_VERSION}/creators/${creatorID}/me`,
        `/api/v${API_VERSION}/creators/${creatorID}/courses/top`,
        `/api/v${API_VERSION}/creators/${creatorID}/courses`,
        `/api/v${API_VERSION}/creators/${creatorID}/courses/${courseID}/edit`,
        `/api/v${API_VERSION}/courses`,
        `/api/v${API_VERSION}/courses/${courseID}/reviews`,
        `/api/v${API_VERSION}/courses/${courseID}/creator/summary`,
        `/api/v${API_VERSION}/courses/${courseID}/creator/summary`,
        `/api/v${API_VERSION}/courses/${courseID}/lessons`,
        `/api/v${API_VERSION}/courses/${courseID}/exams/:exam_id`,
        `/api/v${API_VERSION}/students/:student_id/reports`,
    ];
    for (const route of affectedRoutes) {
        GlobalRouteCache.pub(route);
    }
    return;
});
