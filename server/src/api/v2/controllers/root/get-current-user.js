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
export const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    let deserializedUser = user;
    const emptyPayload = {
        payload: null,
        message: "",
        user: undefined,
    };
    if (!user)
        return res.status(200).json(emptyPayload);
    const resInfo = yield UserModel.search(deserializedUser.id, deserializedUser.role);
    const tmpPayload = {
        payload: null,
        message: "",
        user: Object.assign(Object.assign({}, deserializedUser), resInfo),
    };
    return res.status(200).json(tmpPayload);
});
