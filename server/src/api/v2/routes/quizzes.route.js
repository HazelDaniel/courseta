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
import { QuizModel } from "../../../models/v1/quiz.model.js";
export const v2QuizzesRouter = express.Router();
v2QuizzesRouter.use(passport.initialize());
v2QuizzesRouter.get("/:quiz_id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quiz_id: assessmentID } = req.params;
        const { user } = req;
        const resData = yield QuizModel.search(assessmentID);
        const resPayload = Object.assign({ message: null, payload: resData }, (() => (user ? { user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
