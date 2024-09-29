var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { QuestionModel } from "../../../../models/v1/question.model.js";
import { AnswerModel } from "../../../../models/v1/answer.model.js";
import { API_VERSION } from "../../config.js";
import GlobalRouteCache from "express-pubsubcache";
export const updateAssessment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { assessment_id: assessmentID, creator_id: creatorID } = req.params;
    const assessmentUpdatePayload = req.body;
    const { answerDataList, questionDataList, trashQuestionIDList, parentEntityID, } = assessmentUpdatePayload;
    for (let i = 0; i < questionDataList.length; i++) {
        const entryQuestion = questionDataList[i];
        const { points, positionID, questionText } = entryQuestion;
        const pendingQuestion = new QuestionModel(questionText, points, positionID, assessmentID, undefined, undefined, parentEntityID);
        for (let j = 0; j < answerDataList.length; j++) {
            const entryAnswer = answerDataList[j];
            const { answerText, isCorrect, questionPositionID } = entryAnswer;
            if (questionPositionID === positionID) {
                const pendingAnswer = new AnswerModel(answerText, isCorrect, questionPositionID);
                pendingQuestion.answersData = pendingAnswer;
            }
        }
        pendingQuestion.save();
    }
    for (let k = 0; k < trashQuestionIDList.length; k++) {
        QuestionModel.trashData(trashQuestionIDList[k]);
    }
    yield QuestionModel.saveAll();
    const resPayload = Object.assign({ message: "success!" }, (() => (req.user ? { user: req.user } : null))());
    res.status(201).json(resPayload);
    const affectedRoutes = [
        `/api/v${API_VERSION}/courses/:course_id/lessons`,
        `/api/v${API_VERSION}/courses/:course_id/lessons/edit`,
        `/api/v${API_VERSION}/courses/:course_id/assessments/${assessmentID}/edit`,
        `/api/v${API_VERSION}/courses/:course_id/assessments/${assessmentID}/questions`,
        `/api/v${API_VERSION}/creators/${creatorID}/assessments/${assessmentID}/edit`,
    ];
    for (const route of affectedRoutes) {
        GlobalRouteCache.pub(route);
    }
    return;
});
