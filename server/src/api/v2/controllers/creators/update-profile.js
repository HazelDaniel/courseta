var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UserModel } from "../../../../models/v1/user.model.js";
import { ServerError } from "../../../../utils.js";
import GlobalRouteCache from "express-pubsubcache";
import { API_VERSION } from "../../config.js";
export const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const creatorID = req.params.creator_id;
    const updatePayload = Object.assign(Object.assign({}, req.body), { userID: creatorID });
    try {
        yield UserModel.updateFields(updatePayload, "creator");
    }
    catch (err) {
        throw new ServerError(`could not update fields, check inputs and try again!`, 400);
    }
    const resPayload = Object.assign({ message: "success!" }, (() => (req.user ? { user: req.user } : null))());
    res.status(200).json(resPayload);
    const affectedRoutes = [
        `/api/v${API_VERSION}/courses/:course_id/creator/summary`,
    ];
    for (const route of affectedRoutes) {
        GlobalRouteCache.pub(route);
    }
    return;
});
