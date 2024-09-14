var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EnrollmentModel } from "../../../../models/v1/enrollment.model.js";
import { API_VERSION } from "../../config.js";
import GlobalRouteCache from "express-pubsubcache";
export const enrollCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { course_id: courseID } = req.params;
    const { user } = req;
    const enrollPayload = req.body;
    const { studentID } = enrollPayload;
    const enrollment = new EnrollmentModel(studentID, courseID);
    yield enrollment.save();
    const resPayload = Object.assign({ payload: null, message: "student enrolled successfully!" }, (() => (user ? { user } : null))());
    res.status(200).json(resPayload);
    const affectedRoutes = [
        `/api/v${API_VERSION}/students/${studentID}/courses/unfinished`,
        `/api/v${API_VERSION}/students/${studentID}/courses/recommended`,
        `/api/v${API_VERSION}/students/${studentID}/me`,
        `/api/v${API_VERSION}/students/${studentID}/courses`,
        `/api/v${API_VERSION}/creators/:creator_id/courses/top`,
        `/api/v${API_VERSION}/courses/${courseID}/creator/summary`,
        `/api/v${API_VERSION}/courses/${courseID}`,
    ];
    for (const route of affectedRoutes) {
        GlobalRouteCache.pub(route);
    }
    return;
});
