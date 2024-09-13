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
import { ExamModel } from "../../../models/v1/exam.model.js";
import GlobalRouteCache from "express-pubsubcache";
export const v2ExamsRouter = express.Router();
v2ExamsRouter.use(passport.initialize());
v2ExamsRouter.get("/:exam_id", GlobalRouteCache.createCacheSubscriber(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (res.locals.cachedResponse) {
            return res
                .status(res.locals.cachedResponse.statusCode)
                .set(res.locals.cachedResponse.headers)
                .send(res.locals.cachedResponse.body);
        }
        const { exam_id: assessmentID } = req.params;
        const { user } = req;
        const resData = yield ExamModel.search(assessmentID);
        const resPayload = Object.assign({ message: null, payload: resData }, (() => (user ? { user } : null))());
        return res.status(200).json(resPayload);
    }
    catch (err) {
        next(err);
    }
}));
