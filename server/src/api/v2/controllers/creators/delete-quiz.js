var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { QuizModel } from "../../../../models/v1/quiz.model.js";
import { API_VERSION } from "../../config.js";
import GlobalRouteCache from "express-pubsubcache";
export const deleteQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lesson_id: lessonID, creator_id: creatorID, course_id: courseID, } = req.params;
    yield QuizModel.delete(+lessonID);
    const resPayload = Object.assign({ message: "quiz deleted successfully!" }, (() => (req.user ? { user: req.user } : null))());
    res.status(204).json(resPayload);
    const affectedRoutes = [
        `/api/v${API_VERSION}/courses/${courseID}/lessons`,
        `/api/v${API_VERSION}/students/:student_id/reports`,
        `/api/v${API_VERSION}/creators/${creatorID}/courses/${courseID}/lessons/edit`,
    ];
    for (const route of affectedRoutes) {
        GlobalRouteCache.pub(route);
    }
    return;
});
