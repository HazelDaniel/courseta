var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CreatorModel } from "../../../../models/v1/creator.model.js";
export const requestPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { creator_id: creatorID } = req.params;
    const resultPass = yield CreatorModel.requestPass(creatorID);
    const resPayload = Object.assign({ payload: resultPass, message: "creator pass update success!" }, (() => (req.user ? { user: req.user } : null))());
    return res.status(200).json(resPayload);
});
