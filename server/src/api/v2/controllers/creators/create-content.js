var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LessonModel } from "../../../../models/v1/lesson.model.js";
import { API_VERSION } from "../../config.js";
import GlobalRouteCache from "express-pubsubcache";
export const createContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lesson_id: lessonID, course_id: courseID, creator_id: creatorID, } = req.params;
    const contentCreationPayload = req.body;
    const { contentType, duration, href, title } = contentCreationPayload;
    const pendingLesson = new LessonModel("", undefined, undefined, undefined, +lessonID);
    const resID = yield pendingLesson.addContent(title || "", href || "", duration || 0, contentType);
    const resPayload = Object.assign({ payload: resID, message: "content created successfully!" }, (() => (req.user ? { user: req.user } : null))());
    res.status(201).json(resPayload);
    const affectedRoutes = [
        `/api/v${API_VERSION}/courses/${courseID}`,
        `/api/v${API_VERSION}/creators/${creatorID}/courses/${courseID}/lessons/edit`,
    ];
    for (const route of affectedRoutes) {
        GlobalRouteCache.pub(route);
    }
    return;
});
