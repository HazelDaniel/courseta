var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ExamModel } from "../../../../models/v1/exam.model.js";
import GlobalRouteCache from "express-pubsubcache";
import { API_VERSION } from "../../config.js";
export const createExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { course_id: courseID, creator_id: creatorID } = req.params;
    const examCreationPayload = req.body;
    const { description, duration, startDate, endDate, passScore } = examCreationPayload;
    const currDate = new Date().toISOString();
    const pendingExam = new ExamModel(+courseID, passScore || 0, description || "", duration || 0, startDate || currDate, endDate || currDate); // TODO: make sure that these are passed using validation. do not help the client
    const examID = yield pendingExam.save();
    const resPayload = Object.assign({ payload: examID, message: "exam creation success!" }, (() => (req.user ? { user: req.user } : null))());
    res.status(201).json(resPayload);
    const affectedRoutes = [
        `/api/v${API_VERSION}/courses/${courseID}`,
        `/api/v${API_VERSION}/creators/${creatorID}/courses/${courseID}/exam/edit`,
    ];
    for (const route of affectedRoutes) {
        GlobalRouteCache.pub(route);
    }
    return;
});
