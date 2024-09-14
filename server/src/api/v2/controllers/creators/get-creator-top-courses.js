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
export const getCreatorTopCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const { creator_id: creatorID } = req.params;
    const resCourses = yield CourseModel.getTopCoursesFor(creatorID);
    const resPayload = Object.assign({ payload: resCourses, message: null }, (() => (user ? { user } : null))());
    return res.status(200).json(resPayload);
});
