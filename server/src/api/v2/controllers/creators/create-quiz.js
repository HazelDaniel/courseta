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
export const createQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lesson_id: lessonID, creator_id: creatorID, course_id: courseID, } = req.params;
    const quizCreationPayload = req.body;
    const { quizTitle, description, passScore } = quizCreationPayload;
    const pendingLesson = new LessonModel("", undefined, undefined, undefined, +lessonID);
    const resID = yield pendingLesson.addQuiz(quizTitle, description || "", passScore || 0);
    const resPayload = Object.assign({ payload: resID, message: "quiz creation success!" }, (() => (req.user ? { user: req.user } : null))());
    res.status(201).json(resPayload);
    const affectedRoutes = [
        `/api/v${API_VERSION}/courses/${courseID}`,
        `/api/v${API_VERSION}/creators/${creatorID}/courses/${courseID}/lessons/edit`,
        `/api/v${API_VERSION}/creators/${creatorID}/assessments/:assessment_id/edit`,
    ];
    for (const route of affectedRoutes) {
        GlobalRouteCache.pub(route);
    }
    return;
});
