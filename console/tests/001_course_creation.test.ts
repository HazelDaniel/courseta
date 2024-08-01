import { config } from "dotenv";
config({ path: [".env", ".env.test"] });
import { CourseModel } from "../models/course.model.js";
import { LessonModel } from "../models/lesson.model.js";
import { LessonContentModel } from "../models/lesson-content.model.js";
import { QuizModel } from "../models/quiz.model.js";
import { pool } from "../db";
import { v4 as uuid } from "uuid";
import { randomUUID } from "crypto";

describe("Course and Lesson Creation Integration Tests", () => {
  beforeAll(async () => {
    // Any setup needed before running the tests
  });

  afterAll(async () => {
    // Close the database connection
    await pool.end();
  });

  it("should create a course with correct attributes", async () => {
    const creatorId = process.env.CST_ADMIN_ID; // Replace with a valid UUID
    const courseData = new CourseModel(
      "Test Course",
      "This is a test course",
      "thumbnail-url",
      creatorId as string,
      "tag1 tag2 tag3",
      [], // Empty lesson data
      [], // Empty lesson content data
      [], // Empty quiz data
      randomUUID()
    );

    await courseData.save(creatorId);

    // Fetch the created course to verify its attributes
    const createdCourse = await CourseModel.search(
      courseData.courseID as number
    );

    expect(createdCourse).toBeDefined();
    expect(createdCourse?.detail.title).toBe("Test Course");
    expect(createdCourse?.detail.description).toBe("This is a test course");
    expect(createdCourse.detail.thumbnail.length).toBe(0);
    expect(createdCourse?.detail.creatorID).toBe(creatorId);
    expect(createdCourse?.detail.lessonCount).toBe(0);
    // expect(createdCourse?.detail.quizCount).toBe(0);
    expect(createdCourse?.detail.courseLength).toBe(0);
  });

  it("should create a course with lessons, content, and quizzes", async () => {
    const creatorId = process.env.CST_TEST_ADMIN_ID;
    const lesson1PositionID = 0;
    const lesson2PositionID = 1;
    const lessonData = [
      new LessonModel("Lesson 1", lesson1PositionID),
      new LessonModel("Lesson 2", lesson2PositionID),
    ];
    const lessonContentData = [
      new LessonContentModel(
        "Content 1",
        "video-url-1",
        "video",
        300,
        lesson1PositionID
      ),
      new LessonContentModel(
        "Content 2",
        "article-url",
        "text",
        0,
        lesson2PositionID
      ),
    ];
    const quizData = [
      new QuizModel(
        "Quiz 1",
        "Quiz description",
        70,
        lesson1PositionID,
        lesson1PositionID
      ),
    ];

    const courseData = new CourseModel(
      "Advanced Course",
      "This is an advanced course",
      "advanced-thumbnail-url",
      creatorId as string,
      "advanced programming",
      lessonData,
      lessonContentData,
      quizData,
      randomUUID()
    );

    await courseData.save(creatorId);

    // Fetch the created course to verify its attributes
    // console.log("searching with course id,  ", courseData.courseID);
    const createdCourse = await CourseModel.search(courseData.courseID);

    expect(createdCourse).toBeDefined();
    expect(createdCourse?.detail.title).toBe("Advanced Course");
    expect(createdCourse?.detail.lessonCount).toBe(2);
    // console.log("created course outline is ");
    // console.log(createdCourse?.outline);
    expect(typeof createdCourse?.outline[0].quizID).toBe("string");
    expect(createdCourse?.detail.courseLength).toBe(300);
  });

  it("should throw an error when creating a course with invalid data", async () => {
    try {
      const invalidCourseData = new CourseModel(
        "", // Empty title
        "Description",
        "thumbnail-url",
        "invalid-uuid",
        "tags"
      );

      await expect(invalidCourseData.save()).rejects.toThrow();
    } catch (err) {
      console.error("test suite error: ", err);
    }
  });
});
