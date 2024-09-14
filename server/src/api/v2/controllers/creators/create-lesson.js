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
import { QuizModel } from "../../../../models/v1/quiz.model.js";
import { LessonContentModel } from "../../../../models/v1/lesson-content.model.js";
import { API_VERSION } from "../../config.js";
import GlobalRouteCache from "express-pubsubcache";
export const createLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const creatorID = req.params.creator_id;
    const courseID = req.params.course_id;
    const lessonAdditionpayload = req.body;
    for (let i = 0; i < lessonAdditionpayload.lessonData.length; i++) {
        const lessonEl = lessonAdditionpayload.lessonData[i];
        const pendingLesson = new LessonModel(lessonEl.title, lessonEl.positionID, +courseID);
        for (let j = 0; j < lessonAdditionpayload.lessonContentData.length; j++) {
            const contentEl = lessonAdditionpayload.lessonContentData[j];
            const { contentType, duration, href, lessonPositionID, title } = contentEl;
            if (contentEl.lessonPositionID === lessonEl.positionID) {
                const pendingLessonContent = new LessonContentModel(title, href, contentType, duration, lessonEl.positionID);
                pendingLesson.lessonContentData = pendingLessonContent;
            }
        }
        for (let k = 0; k < lessonAdditionpayload.lessonQuizData.length; k++) {
            const quizEl = lessonAdditionpayload.lessonQuizData[k];
            const { description, lessonPositionID, passScore, quizTitle } = quizEl;
            if (quizEl.lessonPositionID === lessonEl.positionID) {
                const pendingQuiz = new QuizModel(quizTitle, description, passScore, lessonPositionID);
                pendingLesson.lessonQuizData = pendingQuiz;
            }
        }
        pendingLesson.save();
    }
    yield LessonModel.saveAll();
    const resPayload = Object.assign({ message: "success!" }, (() => (req.user ? { user: req.user } : null))());
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
