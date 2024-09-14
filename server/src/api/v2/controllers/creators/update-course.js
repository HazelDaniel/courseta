var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { randomUUID } from "crypto";
import { CourseModel } from "../../../../models/v1/course.model.js";
import { API_VERSION } from "../../config.js";
import GlobalRouteCache from "express-pubsubcache";
export const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const creatorID = req.params.creator_id;
    const courseID = req.params.course_id;
    const courseEditPayload = req.body;
    const courseTitle = (_a = courseEditPayload.info) === null || _a === void 0 ? void 0 : _a.title;
    const courseDescription = (_b = courseEditPayload.info) === null || _b === void 0 ? void 0 : _b.description;
    const [courseImage, courseThumbnail] = courseEditPayload.images;
    const tags = (_c = courseEditPayload.info) === null || _c === void 0 ? void 0 : _c.tags;
    const resultCourse = yield CourseModel.updateFields(+courseID, courseThumbnail, courseDescription, tags, randomUUID(), courseTitle, courseImage);
    const resPayload = Object.assign({ payload: resultCourse, message: "course update success!" }, (() => (req.user ? { user: req.user } : null))());
    res.status(200).json(resPayload);
    const affectedRoutes = [
        `/api/v${API_VERSION}/creators/${creatorID}/courses/top`,
        `/api/v${API_VERSION}/courses`,
        `/api/v${API_VERSION}/creators/${creatorID}/courses`,
        `/api/v${API_VERSION}/creators/${creatorID}/courses/${courseID}/edit`,
        `/api/v${API_VERSION}/students/:student_id/courses/recommended`,
        `/api/v${API_VERSION}/students/:student_id/courses/unfinished`,
        `/api/v${API_VERSION}/students/:student_id/courses`,
    ];
    for (const route of affectedRoutes) {
        GlobalRouteCache.pub(route);
    }
    return;
});
