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
export const deleteExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { course_id: courseID, creator_id: creatorID } = req.params;
    yield ExamModel.delete(+courseID);
    const resPayload = Object.assign({ message: "exam deleted successfully!" }, (() => (req.user ? { user: req.user } : null))());
    res.status(204).json(resPayload);
    const affectedRoutes = [
        `/api/v${API_VERSION}/courses/${courseID}/assessments/:assessment_id/questions`,
        `/api/v${API_VERSION}/students/:student_id/reports`,
    ];
    for (const route of affectedRoutes) {
        GlobalRouteCache.pub(route);
    }
    return;
});
