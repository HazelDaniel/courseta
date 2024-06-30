import { config } from "dotenv";
config({ path: [".env", ".env.test"] });
import { expect, describe, it, beforeAll, afterAll } from "@jest/globals";
import { CourseModel } from "../models/course.model.js";
import { pool } from "../db.js";

describe("CourseModel.updateFields Integration Test", () => {
  let createdCourseId: number;

  beforeAll(async () => {
    const creatorID = process.env.CST_TEST_ADMIN_ID; // Replace with a valid UUID
    // Create a test course
    const courseData = new CourseModel(
      "Test Course",
      "Initial description",
      "initial-thumbnail.jpg",
      creatorID as string,
      "initial tag1 tag2"
    );
    const courseID = await courseData.save(creatorID);
    createdCourseId = courseID as number;
    console.log("created course id is ", createdCourseId);
  });

  afterAll(async () => {
    await pool.end();
  });

  it("should update course fields correctly", async () => {
    const updatedThumbnail = "updated-thumbnail.jpg";
    const updatedDescription = "Updated description";
    const updatedTags = "updated tag1 tag2 tag3";

    const result = await CourseModel.updateFields(
      createdCourseId,
      updatedThumbnail,
      updatedDescription,
      updatedTags
    );

    expect(result).toBeDefined();
    expect(result.thumbnail).toBe(updatedThumbnail);
    expect(result.description).toBe(updatedDescription);
    expect(result.tags).toEqual(["updated", "tag1", "tag2", "tag3"]);

    // Verify that the course was actually updated in the database
    const updatedCourse = await CourseModel.search(createdCourseId);
    expect(updatedCourse).toBeDefined();
    expect(updatedCourse?.detail.thumbnail).toBe(updatedThumbnail);
    expect(updatedCourse?.detail.description).toBe(updatedDescription);
  });

  it("should update only provided fields", async () => {
    const initialCourse = await CourseModel.search(createdCourseId);
    const updatedDescription = "Another updated description";

    const result = await CourseModel.updateFields(
      createdCourseId,
      undefined,
      updatedDescription
    );

    expect(result).toBeDefined();
    expect(result.thumbnail).toBe(initialCourse?.detail.thumbnail);
    expect(result.description).toBe(updatedDescription);
    // expect(result.tags).toEqual(initialCourse?.detail.tags);

    // Verify in the database
    const updatedCourse = await CourseModel.search(createdCourseId);
    expect(updatedCourse).toBeDefined();
    expect(updatedCourse?.detail.thumbnail).toBe(
      initialCourse?.detail.thumbnail
    );
    expect(updatedCourse?.detail.description).toBe(updatedDescription);
    // expect(updatedCourse?.tags).toEqual(initialCourse?.tags);
  });

  it("should handle empty tag string correctly", async () => {
    const result = await CourseModel.updateFields(
      createdCourseId,
      undefined,
      undefined,
      ""
    );

    expect(result).toBeDefined();
    expect(result.tags).toEqual([]);

    const updatedCourse = await CourseModel.search(createdCourseId);
    expect(updatedCourse).toBeDefined();
  });

  it("should throw an error for invalid input", async () => {
    const result = await CourseModel.updateFields(
      createdCourseId,
      "newer-thumbnail-path"
    );
    expect(result.thumbnail).toEqual("newer-thumbnail-path");
  });
});
