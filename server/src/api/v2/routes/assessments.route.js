var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import passport from "passport";
import { QuestionModel } from "../../../models/v1/question.model.js";
import { ServerError } from "../../../utils.js";
import { AssessmentModel } from "../../../models/v1/assessment.model.js";
export const v2AssessmentsRouter = express.Router();
v2AssessmentsRouter.use(passport.initialize());
v2AssessmentsRouter.get("/:assessment_id/questions", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assessment_id: assessmentID } = req.params;
        const { user } = req;
        const resData = yield QuestionModel.getQuestionsFor(assessmentID);
        const resPayload = Object.assign({ message: null, payload: resData }, (() => (user ? { user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
v2AssessmentsRouter.post("/:assessment_id/submit", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assessment_id: assessmentID } = req.params;
        const { user } = req;
        if (!user.id)
            throw new ServerError("no student id included in the request", 400);
        const { answerList, assessmentType, questionIDList, submissionTime } = req.body;
        yield AssessmentModel.submit(user.id, assessmentID, questionIDList, answerList, submissionTime || "", assessmentType);
        const resPayload = Object.assign({ message: "assessment submitted successfully!", payload: null }, (() => (user ? { user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
