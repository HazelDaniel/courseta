import { BaseModel } from "./base-model.js";

export class AnswerModel extends BaseModel<void> {
  constructor(
    public answerText: string,
    public isCorrect: boolean,
    public questionPositionID: number
  ) {
    super();
  }

  static all(): Promise<object[]> {
    return Promise.resolve([]);
  }

  static search(questionID: string | null) {
    return Promise.resolve({});
  }

  get all() {
    return [];
  }

  search(questionID: string | null) {
    return null;
  }

  async save() {
    return new Promise((resolve, _1) => {
      resolve({});
    });
  }
}
