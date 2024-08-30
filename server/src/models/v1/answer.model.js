var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseModel } from "./base-model.js";
export class AnswerModel extends BaseModel {
    constructor(answerText, isCorrect, questionPositionID) {
        super();
        this.answerText = answerText;
        this.isCorrect = isCorrect;
        this.questionPositionID = questionPositionID;
    }
    static all() {
        return Promise.resolve([]);
    }
    static search(questionID) {
        return Promise.resolve({});
    }
    get all() {
        return [];
    }
    search(questionID) {
        return null;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, _1) => {
                resolve({});
            });
        });
    }
}
