import { config } from "dotenv";
config({ path: [".env", ".env.test"] });
import { expect, describe, it, beforeAll, afterAll } from "@jest/globals";
import { CourseModel } from "../models/v1/course.model.js";
import { pool } from "../db.js";
import { randomUUID } from "crypto";

describe("CourseModel.updateFields Integration Test", () => {
  let createdCourseId: number;
  const courseImage =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCABLAN4DASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAED/8QAHhABAQABAwUAAAAAAAAAAAAAABEBUbHRcYGRweH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A0AAAAAAEpQUSlBRKUFAAAAAAAAAAEqgCKACQFAAAAABIRQEhFASKAAAAAAAAAAAJFAAAAAAAAAAAE7/C+FATg164UBFAAAAAAAAABFAQUBBQAAAAAAAAASbALRJsQFEJuCiT2c4BRIoAAAAAAAigCAKAAAAAAAAAAAAAAAAAAAAAAAAAACZBQAf/2Q==";
  beforeAll(async () => {
    const creatorID = process.env.CST_TEST_ADMIN_ID; // Replace with a valid UUID
    // Create a test course
    const courseData = new CourseModel(
      "Test Course",
      "Initial description",
      courseImage,
      creatorID as string,
      "initial tag1 tag2",
      undefined,
      undefined,
      undefined,
      randomUUID()
    );
    const courseID = await courseData.save(creatorID);
    createdCourseId = courseID as number;
  });

  afterAll(async () => {
    await pool.end();
  });

  it("should update course fields correctly", async () => {
    const updatedThumbnail =
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCABLAN4DASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAED/8QAHhABAQABAwUAAAAAAAAAAAAAABEBUbHRcYGRweH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A0AAAAAAEpQUSlBRKUFAAAAAAAAAAEqgCKACQFAAAAABIRQEhFASKAAAAAAAAAAAJFAAAAAAAAAAAE7/C+FATg164UBFAAAAAAAAABFAQUBBQAAAAAAAAASbALRJsQFEJuCiT2c4BRIoAAAAAAAigCAKAAAAAAAAAAAAAAAAAAAAAAAAAACZBQAf/2Q==";
    const updatedDescription = "Updated description";
    const updatedTags = "updated tag1 tag2 tag3";

    const result = await CourseModel.updateFields(
      createdCourseId,
      updatedThumbnail,
      updatedDescription,
      updatedTags,
      randomUUID()
    );

    /* ts-ignore */
    // console.log("sent thumbnail is ", updatedThumbnail);
    // console.log("result thumbnail ", result.thumbnail);

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
      updatedDescription,
      undefined,
      randomUUID()
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
      "",
      randomUUID()
    );

    expect(result).toBeDefined();
    expect(result.tags).toEqual(["updated", "tag1", "tag2", "tag3"]);

    const updatedCourse = await CourseModel.search(createdCourseId);
    expect(updatedCourse).toBeDefined();
  });

  it("test a thumbnail update", async () => {
    const result = await CourseModel.updateFields(
      createdCourseId,
      "newer-thumbnail-path",
      undefined,
      undefined,
      randomUUID()
    );
    expect(result.thumbnail).toEqual(courseImage); // well, because that isn't valid base64
  });
});
