import { AssessmentModel } from "../models/v1/assessment.model.js";
import { QuizModel } from "../models/v1/quiz.model.js";
import { ExamModel } from "../models/v1/exam.model.js";
import { QuestionModel } from "../models/v1/question.model.js";
import { AnswerModel } from "../models/v1/answer.model.js";
import { pool } from "../db";
import type { AssessmentVariantType, lessonVariantType } from "../types";
import { CourseModel } from "../models/v1/course.model.js";
import { LessonModel } from "../models/v1/lesson.model.js";
import { LessonContentModel } from "../models/v1/lesson-content.model.js";

let creatorID: string | undefined;
let course1ID: number;
describe("AssessmentModel Integration Tests", () => {
  beforeAll(async () => {
    creatorID = process.env.CST_TEST_ADMIN_ID; // Replace with a valid UUID
    // Create a test course
  });

  afterAll(async () => {
    await pool.end();
  });

  // describe("Quiz Creation", () => {
  //   it("should create a new quiz with questions and answers", async () => {
  //     const lesson1PositionID = 0;
  //     const lesson2PositionID = 1;
  //     const lessonData = [
  //       new LessonModel("Lesson 1a", lesson1PositionID),
  //       new LessonModel("Lesson 2a", lesson2PositionID),
  //     ];

  //     const courseData = new CourseModel(
  //       "Test Course",
  //       "This is a test course",
  //       "thumbnail-url",
  //       creatorID as string,
  //       "tag1 tag2 tag3",
  //       lessonData, // Empty lesson data
  //       [], // Empty lesson content data
  //       [] // Empty quiz data
  //     );

  //     course1ID = await courseData.save(creatorID as string);

  //     const quiz = new QuizModel(
  //       "Sample Quiz",
  //       "This is a sample quiz",
  //       70, // passScore
  //       undefined,
  //       1 // parentEntityID (lessonID). NOTE:we shouldn't be using a hard coded value. we'll run into unique constraint violations due to idempotency problem
  //     );

  //     const question1 = new QuestionModel("What is 2+2?", 5, 0);
  //     quiz.questionData = question1;

  //     const answer1 = new AnswerModel("4", true, 0);
  //     const answer2 = new AnswerModel("5", false, 0);
  //     quiz.answerData = answer1;
  //     quiz.answerData = answer2;

  //     const quizId = await quiz.save();

  //     expect(quizId).toBeTruthy();
  //     expect(typeof quizId).toBe("string");
  //   });
  // });
  describe("Lesson Content Validation", () => {
    it("should throw an error if no lesson ID is provided", async () => {
      const lessonContent = new LessonContentModel(
        "Invalid Content",
        "invalid-content-url",
        "video" as lessonVariantType,
        60
      );

      await expect(lessonContent.save()).rejects.toThrow(
        "no lesson id provided!"
      );
    });
  });

  describe("Exam Creation", () => {
    it("should create a new exam with questions and answers", async () => {
      const courseData = new CourseModel(
        "Test Course",
        "This is a test course",
        "thumbnail-url",
        creatorID as string,
        "tag1 tag2 tag3",
        [], // Empty lesson data
        [], // Empty lesson content data
        [] // Empty quiz data
      );

      course1ID = await courseData.save(creatorID as string);
      const exam = new ExamModel(
        course1ID, // parentEntityID (courseID)
        70, // passScore
        "Sample Exam",
        120, // duration
        "2024-07-01T00:00:00Z", // startDate
        "2024-07-31T23:59:59Z", // endDate
        "exam" as AssessmentVariantType
      );

      const question1 = new QuestionModel("Describe the water cycle", 30, 0);
      exam.questionData = question1;

      const answer1 = new AnswerModel(
        "Correct description of water cycle",
        true,
        0
      );
      exam.answerData = answer1;

      const examId = await exam.save();

      expect(examId).toBeTruthy();
      expect(typeof examId).toBe("string");
    });
  });

  describe("Assessment Validation", () => {
    it("should ensure each question has at least one correct answer", async () => {
      const quiz = new QuizModel(
        "Invalid Quiz",
        "This quiz should not save",
        70,
        undefined,
        1
      );

      const question1 = new QuestionModel("What is 2+2?", 5, 0);
      quiz.questionData = question1;

      const answer1 = new AnswerModel("5", false, 0);
      quiz.answerData = answer1;

      await expect(quiz.save()).rejects.toThrow();
    });
  });

  describe("AssessmentModel Static Methods", () => {
    it("should retrieve all assessments", async () => {
      const assessments = await AssessmentModel.all();

      expect(Array.isArray(assessments)).toBe(true);
    });

    it("should have a placeholder for search functionality", async () => {
      // This is a placeholder test for the search functionality
      const searchResult = await AssessmentModel.search("some-id");
      expect(searchResult).toBeDefined();
    });
  });
});
