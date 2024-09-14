import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types";
import { AssessmentEditPayloadType } from "../../../../client.types.js";
import { QuestionModel } from "../../../../models/v1/question.model.js";
import { AnswerModel } from "../../../../models/v1/answer.model.js";
import { API_VERSION } from "../../config.js";
import GlobalRouteCache from "express-pubsubcache";

export const updateAssessment = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { assessment_id: assessmentID } = req.params;
  const assessmentUpdatePayload: AssessmentEditPayloadType =
    req.body as AssessmentEditPayloadType;
  const {
    answerDataList,
    questionDataList,
    trashQuestionIDList,
    parentEntityID,
  } = assessmentUpdatePayload;
  for (let i = 0; i < questionDataList.length; i++) {
    const entryQuestion = questionDataList[i];
    const { points, positionID, questionText } = entryQuestion;
    const pendingQuestion = new QuestionModel(
      questionText,
      points,
      positionID,
      assessmentID,
      undefined,
      undefined,
      parentEntityID
    );
    for (let j = 0; j < answerDataList.length; j++) {
      const entryAnswer = answerDataList[j];
      const { answerText, isCorrect, questionPositionID } = entryAnswer;
      if (questionPositionID === positionID) {
        const pendingAnswer = new AnswerModel(
          answerText,
          isCorrect,
          questionPositionID
        );
        pendingQuestion.answersData = pendingAnswer;
      }
    }
    pendingQuestion.save();
  }
  for (let k = 0; k < trashQuestionIDList.length; k++) {
    QuestionModel.trashData(trashQuestionIDList[k]);
  }

  await QuestionModel.saveAll();
  const resPayload: ServerPayloadType<string> = {
    message: "success!",
    ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
  };
  res.status(201).json(resPayload);

  const affectedRoutes = [
    `/api/v${API_VERSION}/courses/:course_id/lessons`,
    `/api/v${API_VERSION}/courses/:course_id/lessons/edit`,
    `/api/v${API_VERSION}/courses/:course_id/assessments/${assessmentID}/edit`,
    `/api/v${API_VERSION}/courses/:course_id/assessments/${assessmentID}/questions`,
  ];
  for (const route of affectedRoutes) {
    GlobalRouteCache.pub(route);
  }
  return;
};
