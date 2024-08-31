var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { pool } from "../../db.js";
import chalk from "chalk";
import { BaseModel } from "./base-model.js";
import { BoardDisplay, ServerError } from "../../utils.js";
import { serializeImage } from "../../serializers/db.serializer.js";
import { deserializeImage } from "../../deserializers/db.deserializer.js";
import v1Config from "../../api/v1/config.js";
export class CourseModel extends BaseModel {
    constructor(title, description, thumbnail, creatorID, tags, lessonData, lessonContentData, lessonQuizData, avatarID) {
        super();
        this.title = title;
        this.description = description;
        this.thumbnail = thumbnail;
        this.creatorID = creatorID;
        this.tags = tags;
        this.lessonData = lessonData;
        this.lessonContentData = lessonContentData;
        this.lessonQuizData = lessonQuizData;
        this.avatarID = avatarID;
        this.courseID = null;
    }
    get all() {
        try {
            return CourseModel.all();
        }
        catch (err) {
            return [];
        }
    }
    static all(opts) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            let res;
            let query;
            try {
                if (!opts) {
                    query = {
                        name: "get_all_courses",
                        text: "SELECT * FROM get_course_summaries()",
                    };
                    res = (yield client.query(query));
                    const { rows } = res;
                    const resCourses = rows.map((el) => {
                        const { course_id: courseID, lesson_count: lessonCount, avatar, title, avatar_meta, } = el;
                        return {
                            courseID: +courseID,
                            lessonCount: lessonCount,
                            avatar: deserializeImage(avatar, avatar_meta.mime_type) || "",
                            avatarMeta: avatar_meta,
                            title,
                        };
                    });
                    resolve(resCourses);
                }
                else {
                    if (!opts.variant)
                        throw new ServerError("no user type provided!", 422);
                    if (!opts.creatorID && !opts.studentID)
                        throw new ServerError("no user id provided!", 422);
                    let resCourses;
                    switch (opts.variant) {
                        case "creator": {
                            query = {
                                name: "get_all_courses_for_creator",
                                text: "SELECT * FROM get_course_summaries_for_creator($1)",
                                values: [opts.creatorID],
                            };
                            res = (yield client.query(query));
                            const { rows } = res;
                            resCourses = rows.map((el) => {
                                const { course_id: courseID, avatar, title, avatar_meta, created_at, tags, updated_at, student_count, archived, } = el;
                                return {
                                    courseID: +courseID,
                                    title,
                                    avatar: deserializeImage(avatar, avatar_meta.mime_type) || "",
                                    avatarMeta: avatar_meta,
                                    createdAt: created_at,
                                    tags,
                                    updatedAt: updated_at,
                                    studentCount: student_count,
                                    archived,
                                };
                            });
                            break;
                        }
                        default: {
                            query = {
                                name: "get_all_courses_for_student",
                                text: "SELECT * FROM get_course_summaries_for_student($1)",
                                values: [opts.studentID],
                            };
                            res = (yield client.query(query));
                            const { rows } = res;
                            resCourses = rows.map((el) => {
                                const { course_id: courseID, avatar, title, avatar_meta, lesson_count, progress, } = el;
                                return {
                                    courseID: +courseID,
                                    title,
                                    avatar: deserializeImage(avatar, avatar_meta.mime_type) || "",
                                    avatarMeta: avatar_meta,
                                    lessonCount: +lesson_count,
                                    progress,
                                };
                            });
                            break;
                        }
                    }
                    resolve(resCourses || []);
                }
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not fetch courses!. reason: ${err}`);
                reject();
            }
            finally {
                client.release();
            }
        }));
    }
    static allRecommended(studentID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "get_recommended_courses_for_student",
                    text: "SELECT * FROM get_recommended_courses_for_student($1)",
                    values: [studentID],
                };
                const res = yield client.query(query);
                const { rows } = res;
                const resCourses = rows.map((el) => {
                    const { course_id: courseID, lesson_count: lessonCount, avatar, avatar_meta, title, } = el;
                    return {
                        courseID: +courseID,
                        lessonCount: +lessonCount,
                        avatar: deserializeImage(avatar, avatar_meta.mime_type) || "",
                        avatarMeta: avatar_meta,
                        title,
                    };
                });
                resolve(resCourses);
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not fetch recommended courses!. reason: ${err}`);
                reject(err);
            }
            finally {
                client.release();
            }
        }));
    }
    static getTopCoursesFor(creatorID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "get_creator_top_courses",
                    text: "SELECT * FROM get_creator_top_courses($1)",
                    values: [creatorID],
                };
                const res = yield client.query(query);
                const { rows } = res;
                const resCourses = rows.map((el) => {
                    const { course_id: courseID, student_count: studentCount, avatar, avatar_meta, title, } = el;
                    return {
                        courseID: +courseID,
                        studentCount,
                        avatar: deserializeImage(avatar, avatar_meta.mime_type) || "",
                        avatarMeta: avatar_meta,
                        title,
                    };
                });
                resolve(resCourses);
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not fetch creator's top courses!. reason: ${err}`);
                reject(err);
            }
            finally {
                client.release();
            }
        }));
    }
    static allRecentUnfinished(studentID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "get_student_recent_unfinished_course",
                    text: "SELECT * FROM get_student_recent_unfinished_course($1)",
                    values: [studentID],
                };
                const res = yield client.query(query);
                const { rows } = res;
                const resCourses = rows.map((el) => {
                    const { course_id: courseID, lesson_count: lessonCount, avatar, avatar_meta, title, progress, } = el;
                    return {
                        courseID: +courseID,
                        lessonCount: +lessonCount,
                        avatar: deserializeImage(avatar, avatar_meta.mime_type) || "",
                        avatarMeta: avatar_meta,
                        title,
                        progress: +progress,
                    };
                });
                resolve(resCourses || []);
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not fetch last unfinished courses!. reason: ${err}`);
                reject(err);
            }
            finally {
                client.release();
            }
        }));
    }
    static display(CourseOutline) {
        const { level1Nest, level3Nest, border, marginDecoratorCount } = BoardDisplay;
        const { detail, lessons } = CourseOutline;
        console.log("");
        console.log(`${chalk.green("<>".repeat(marginDecoratorCount))}`);
        console.log(level1Nest, chalk.cyan("[COURSE]\n"));
        console.log(`${border}${level1Nest} title: ${detail.title}`);
        console.log(`${border}${level1Nest} length: ${detail.courseLength}s long`);
        console.log(`${border}${level1Nest} description: ${detail.description}`);
        console.log(`${border}${level1Nest} ratings: ${detail.averageRating} (${detail.reviewCount})`);
        console.log(chalk.overline(`${border}${level3Nest} last updated: ${detail.updatedAt}`));
        console.log(chalk.overline(`${border}${level3Nest} members enrolled: ${detail.studentCount}`));
        console.log(level1Nest, chalk.cyan("[OUTLINE]\n"));
        lessons.forEach((entry) => {
            var _a;
            console.log(chalk.overline(`${border}${level1Nest} ${entry.title} || (${entry.contentCount} contents) ${entry.duration}s long`), entry.quiz
                ? chalk.overline(`${border}${level1Nest} [QUIZ]: ${(_a = entry.quiz) === null || _a === void 0 ? void 0 : _a.title} || (${entry.quiz.totalPoints} points)`)
                : ""
            // chalk.overline(
            //   `${border}${level1Nest} [QUIZ]: ${entry.quizTitle} || (${entry.totalPoints} points)`
            // )
            );
        });
        console.log(`${chalk.green("<>".repeat(marginDecoratorCount))}`);
        console.log("");
    }
    static search(courseID, opts) {
        const fetchCourse = () => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const courseQuery = {
                    name: "get_course_details",
                    text: "SELECT * FROM get_course_details($1)",
                    values: [courseID],
                };
                const courseReq = client.query(courseQuery);
                let combineResPromise;
                if (!opts) {
                    combineResPromise = Promise.all([courseReq]);
                    const [courseResolved] = yield combineResPromise;
                }
                else {
                    combineResPromise = Promise.all([
                        courseReq,
                        CourseModel.getLessonsFor(courseID, "read"),
                    ]);
                }
                const [courseResolved, courseOutlineResolved] = yield combineResPromise;
                let { rows: courseRows } = courseResolved;
                const resCourse = courseRows.map((el) => {
                    const { creator_id, description, lesson_count, review_count, student_count, title, course_length, updated_at, average_rating, avatar, avatar_meta, exam_id, } = el;
                    return {
                        creatorID: creator_id,
                        description,
                        lessonCount: +lesson_count,
                        reviewCount: +review_count,
                        studentCount: +student_count,
                        avatar: deserializeImage(avatar, avatar_meta.mime_type) || "",
                        avatarMeta: avatar_meta,
                        title,
                        courseLength: +course_length,
                        updatedAt: updated_at,
                        courseID: +courseID,
                        averageRating: +average_rating,
                        examID: exam_id,
                    };
                })[0];
                if (!opts)
                    return { detail: resCourse };
                return { detail: resCourse, lessons: courseOutlineResolved };
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not fetch course!. reason: ${err}`);
                throw err;
            }
            finally {
                client.release();
            }
        });
        return fetchCourse();
    }
    static delete(courseID, creatorID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "p_02_delete_course_if_creator_is",
                    text: "SELECT p_02_delete_course_if_creator_is($1, $2)",
                    values: [courseID, creatorID],
                };
                yield client.query(query);
                resolve();
            }
            catch (err) {
                reject(new ServerError(`${(err === null || err === void 0 ? void 0 : err.message) || "you can't delete this course"}`, 400));
            }
            finally {
                client.release();
            }
        }));
    }
    static archive(courseID, creatorID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "archive_course_for_creator",
                    text: "SELECT archive_course_for_creator($1, $2)",
                    values: [courseID, creatorID],
                };
                yield client.query(query);
                resolve();
            }
            catch (err) {
                reject(err);
            }
            finally {
                client.release();
            }
        }));
    }
    static unarchive(courseID, creatorID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "unarchive_course_for_creator",
                    text: "SELECT unarchive_course_for_creator($1, $2)",
                    values: [courseID, creatorID],
                };
                yield client.query(query);
                resolve();
            }
            catch (err) {
                reject(err);
            }
            finally {
                client.release();
            }
        }));
    }
    static fetchForEdit(courseID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "get_course_for_creator_edit",
                    text: "SELECT * FROM get_course_for_creator_edit($1)",
                    values: [courseID],
                };
                const res = yield client.query(query);
                const { rows } = res;
                const { avatar_meta, avatar_url, description, tags, title } = rows[0];
                const resCourseData = {
                    avatar: deserializeImage(avatar_url, avatar_meta.mime_type || "") || "",
                    avatarMeta: avatar_meta,
                    description,
                    title,
                    tags,
                };
                console.log("resolved course data is ");
                resolve(resCourseData);
            }
            catch (err) {
                reject(err);
            }
            finally {
                client.release();
            }
        }));
    }
    static getReviewsFor(courseID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "get_course_reviews",
                    text: "SELECT * FROM get_course_reviews($1)",
                    values: [courseID],
                };
                const res = yield client.query(query);
                const { rows } = res;
                const resReviews = rows.map((review) => {
                    const { avatar, avatar_meta, created_at, email, rating, review_text, student_id, } = review;
                    return {
                        avatar: deserializeImage(avatar, avatar_meta.mime_type || ""),
                        avatarMeta: avatar_meta,
                        dateCreated: created_at,
                        studentEmail: email,
                        rating,
                        reviewText: review_text,
                        studentID: student_id,
                    };
                });
                resolve(resReviews);
            }
            catch (err) {
                reject(err);
            }
            finally {
                client.release();
            }
        }));
    }
    static getCreatorFor(courseID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "get_course_creator",
                    text: "SELECT * FROM get_course_creator($1)",
                    values: [courseID],
                };
                const res = yield client.query(query);
                const { rows } = res;
                const { avatar, avatar_meta, average_course_rating, course_review_count, creator_id, email, first_name, last_name, student_count, } = rows[0];
                const resCreator = {
                    id: creator_id,
                    email,
                    firstName: first_name,
                    lastName: last_name,
                    avatar: deserializeImage(avatar, avatar_meta.mime_type || "") || "",
                    avatarMeta: avatar_meta,
                    averageCourseRating: average_course_rating,
                    courseCount: course_review_count,
                    courseReviewCount: course_review_count,
                    studentCount: student_count,
                };
                resolve(resCreator);
            }
            catch (err) {
                reject(err);
            }
            finally {
                client.release();
            }
        }));
    }
    static getLessonsFor(courseID, mode) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                switch (mode) {
                    case "read": {
                        const query = {
                            name: "get_course_lessons",
                            text: "SELECT * FROM get_course_lessons($1)",
                            values: [courseID],
                        };
                        const res = yield client.query(query);
                        const { rows } = res;
                        const resLessons = rows.map((lesson) => {
                            let { content_count, lesson_id, total_duration, contents, quizzes, title, } = lesson;
                            quizzes = quizzes.filter((quiz) => !!quiz.id);
                            contents = contents.filter((content) => !!content.id);
                            return {
                                id: lesson_id,
                                contents: quizzes,
                                quiz: contents[0],
                                duration: total_duration,
                                title,
                                contentCount: content_count,
                            };
                        });
                        resolve(resLessons);
                        break;
                    }
                    case "edit": {
                        const query = {
                            name: "get_course_lesson_tree_for_creator_edit",
                            text: "SELECT * FROM get_course_lesson_tree_for_creator_edit($1)",
                            values: [courseID],
                        };
                        const res = yield client.query(query);
                        const { rows } = res;
                        const resLessons = rows.map((lesson) => {
                            let { content_count, lesson_id, total_duration, contents, quizzes, title, } = lesson;
                            quizzes = quizzes.filter((quiz) => !!quiz.id);
                            contents = contents.filter((content) => !!content.id);
                            return {
                                id: lesson_id,
                                contents: quizzes,
                                quiz: contents[0],
                                duration: total_duration,
                                title,
                                contentCount: content_count,
                            };
                        });
                        resolve(resLessons);
                        break;
                    }
                }
            }
            catch (err) {
                reject(err);
            }
            finally {
                client.release();
            }
        }));
    }
    search(courseID) {
        try {
            return CourseModel.search(courseID);
        }
        catch (err) {
            return null;
        }
    }
    save(creatorID) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const client = yield pool.connect();
            try {
                let query;
                let serializedImage = serializeImage(this.thumbnail || "");
                let byteImage;
                let mimeType;
                if (serializedImage) {
                    const { data, mime } = serializedImage;
                    byteImage = data;
                    mimeType = mime;
                }
                else {
                    byteImage = "";
                    mimeType = "";
                }
                const emptyCourse = {
                    title: this.title,
                    description: this.description,
                    avatarID: this.avatarID || "",
                    mimeType,
                    creatorID: this.creatorID,
                    tags: ((_a = this.tags) === null || _a === void 0 ? void 0 : _a.split(" ").filter((str) => !!str)) || [],
                };
                const values = [
                    creatorID,
                    JSON.stringify(emptyCourse),
                    byteImage,
                    JSON.stringify(this.lessonData),
                    JSON.stringify(this.lessonQuizData),
                    JSON.stringify(this.lessonContentData),
                ];
                // console.log("input values are :");
                // console.log(values);
                if (creatorID) {
                    query = {
                        name: "create_course_for_creator",
                        text: "SELECT create_course_for_creator($1, $2, $3, $4, $5, $6)",
                        values: values,
                    };
                    const res = yield client.query(query);
                    const courseID = res.rows[0].create_course_for_creator;
                    this.courseID = +courseID;
                    this.show();
                    return +courseID;
                }
                else {
                    query = {
                        name: "set_new_course",
                        text: "SELECT course_id FROM set_new_course($1, $2, $3, $4, $5, $6, $7)",
                        values: [
                            this.title,
                            this.description,
                            byteImage,
                            this.avatarID || "",
                            mimeType,
                            this.creatorID,
                            this.tags.split(" "),
                        ],
                    };
                    const res = yield client.query(query);
                    const courseID = res.rows[0].course_id;
                    this.courseID = +courseID;
                    this.show();
                    return +courseID;
                }
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not create course!. reason: ${err}`);
                throw new Error(err);
            }
            finally {
                client.release();
            }
        });
    }
    static updateFields(courseID, thumbnail, description, tags, avatarID, title, originalImage, isImageRedacted = true) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            let imageUpdateStatus = 200;
            isImageRedacted = isImageRedacted && !!originalImage;
            try {
                if (isImageRedacted) {
                    const imageServerPayload = {
                        avatarMeta: {
                            id: avatarID,
                            created_at: "",
                            updated_at: "",
                            mime_type: "",
                        },
                        newAvatar: [originalImage || "", thumbnail || ""],
                    };
                    const requestUrl = `${v1Config.serverOptions.imageServerBaseUrl}/${avatarID}`;
                    const request = yield fetch(`${requestUrl}`, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(imageServerPayload),
                        method: "put",
                    });
                    if (!request.ok)
                        imageUpdateStatus = request.status;
                }
                if (imageUpdateStatus !== 200) {
                    if (imageUpdateStatus - 400 < 99 && imageUpdateStatus >= 400)
                        reject(new ServerError("could not update image!. check inputs ", 400));
                    else
                        reject(new ServerError("something went wrong updating the image. please try again.", imageUpdateStatus));
                }
                let serializedImage = serializeImage(thumbnail || "");
                let byteImage;
                let mimeType;
                if (serializedImage) {
                    const { data, mime } = serializedImage;
                    byteImage = data;
                    mimeType = mime;
                }
                else {
                    byteImage = null;
                    mimeType = null;
                }
                const courseDiff = {
                    thumbnail: byteImage,
                    avatar: { url: byteImage, id: avatarID, mimeType: mimeType },
                    description: description || "",
                    tags: (tags === null || tags === void 0 ? void 0 : tags.split(" ").filter((str) => !!str)) || [],
                    title,
                    courseID,
                };
                // console.log("course difference is ");
                // console.log(courseDiff);
                const query = {
                    name: "update_course_attributes",
                    text: "SELECT * FROM update_course_attributes($1)",
                    values: [courseDiff],
                };
                const res = yield client.query(query);
                const resCourse = res.rows[0];
                const { description: resDesc, tags: resTags, url, meta } = resCourse;
                // console.log("url is ", url);
                // console.log(" and mime type is ", mimeType);
                const transformedCourse = {
                    description: resDesc,
                    tags: resTags,
                    thumbnail: deserializeImage(url, meta.mime_type),
                };
                resolve(transformedCourse);
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not update course details!. reason: ${err}`);
                reject(new Error(err));
            }
            finally {
                client.release();
            }
        }));
    }
}
