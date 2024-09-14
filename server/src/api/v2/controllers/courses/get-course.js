var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CourseModel } from "../../../../models/v1/course.model.js";
import { EnrollmentModel } from "../../../../models/v1/enrollment.model.js";
export const getCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { course_id: courseID } = req.params;
    const { user } = req;
    const resCoursePromise = CourseModel.search(+courseID);
    const studentEnrollmentStatus = EnrollmentModel.confirmEnrollment(((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || "", courseID);
    const resPromises = yield Promise.all([
        resCoursePromise,
        studentEnrollmentStatus,
    ]);
    const status = resPromises[1];
    const resPayload = Object.assign({ payload: Object.assign(Object.assign({}, resPromises[0].detail), { isEnrolled: status }), message: null }, (() => (user ? { user } : null))());
    return res.status(200).json(resPayload);
});
