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
export const getCourseLessonQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { quiz_id: assessmentID } = req.params;
    const { user } = req;
    const resultAssessment = yield QuizModel.search(assessmentID);
    const resPayload = Object.assign({ payload: resultAssessment, message: null }, (() => (user ? { user } : null))());
    return res.status(200).json(resPayload);
});
