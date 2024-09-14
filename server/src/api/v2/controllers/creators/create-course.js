var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { randomUUID } from "crypto";
import { CourseModel } from "../../../../models/v1/course.model.js";
import { ServerError } from "../../../../utils.js";
import v2Config, { API_VERSION } from "../../config.js";
import GlobalRouteCache from "express-pubsubcache";
export const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const creatorID = req.params.creator_id;
    const courseCreationPayload = req.body;
    const courseTitle = (_a = courseCreationPayload.info) === null || _a === void 0 ? void 0 : _a.title;
    const courseDescription = (_b = courseCreationPayload.info) === null || _b === void 0 ? void 0 : _b.description;
    const [courseThumbnail, courseImage] = courseCreationPayload.images;
    const tags = (_c = courseCreationPayload.info) === null || _c === void 0 ? void 0 : _c.tags;
    const generatedImageID = randomUUID();
    const pendingCourse = new CourseModel(courseTitle || "", courseDescription || "", courseThumbnail, creatorID, tags, undefined, undefined, undefined, generatedImageID);
    let imageUploadRequest = null;
    const imageUploadpayload = {
        id: generatedImageID,
        imageUrl: courseImage,
    };
    if (!!courseImage)
        imageUploadRequest = yield fetch(`${v2Config.serverOptions.imageServerBaseUrl}/api/v2/images`, {
            headers: {
                "Content-Type": "application/json",
                Cookie: "",
            },
            method: "post",
            body: JSON.stringify(imageUploadpayload),
        });
    if (!imageUploadRequest || (imageUploadRequest && imageUploadRequest.ok)) {
        const courseID = yield pendingCourse.save(creatorID);
        const resPayload = Object.assign({ payload: courseID, message: "course creation success!" }, (() => (req.user ? { user: req.user } : null))());
        res.status(201).json(resPayload);
        const { creator_id } = req.params;
        const affectedRoutes = [
            `/api/v${API_VERSION}/creators/${creator_id}/me`,
            `/api/v${API_VERSION}/courses/:course_id/creator/summary`,
        ];
        for (const route of affectedRoutes) {
            GlobalRouteCache.pub(route);
        }
        return;
    }
    else {
        if (imageUploadRequest.status - 400 < 99 &&
            imageUploadRequest.status >= 400)
            throw new ServerError("could not upload image!. check inputs ", 400);
        else
            throw new ServerError("something went wrong uploading the image. please try again.", imageUploadRequest.status);
    }
});
