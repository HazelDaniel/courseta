\x
\set courseta_var_creator_id_1 2aac9187-e2e9-4326-9c0b-920bfa0143b4
\set courseta_var_creator_id_2 47621eb8-08e0-42d4-87cb-8efac5676290

\set courseta_var_student_id_1 9ae767db-0a13-4cea-8d1f-99c25fa831f6
\set courseta_var_student_id_2 a69c1374-d4ef-4644-a791-fd8b6601aa8c
\set courseta_var_student_id_3 a69c1304-d4af-4644-c082-fd8b6601aa8d

\set courseta_var_course_id_1 1
\set courseta_var_course_id_2 2
\set courseta_var_course_id_3 3

\set courseta_var_lesson_id_1 1
\set courseta_var_lesson_id_2 2

\set courseta_var_quiz_id_1 a69c1374-d4af-4644-a791-fd8b6601aa8c
\set courseta_var_quiz_id_2 b69c1374-d4af-4644-a791-fd8b6601aa8c

\set courseta_var_exam_id_1 f69c1374-d4af-4644-a791-fd8b6601aa7d

\set courseta_var_question_id_1 1
\set courseta_var_question_id_2 2

\set courseta_var_answer_id_1 1
\set courseta_var_answer_id_2 2

\set courseta_var_answer_id_3 3
\set courseta_var_answer_id_4 4
\set courseta_var_answer_id_5 5
\set courseta_var_answer_id_6 6


\set courseta_var_submission_time '2024-06-04 15:03:37.808+02'


INSERT INTO creators (email, first_name, last_name, password, creator_id)
VALUES ('hazel856@gmail.com', 'hazel', 'daniel', '8080', :'courseta_var_creator_id_1') ON CONFLICT DO NOTHING;

INSERT INTO creators (email, first_name, last_name, password, creator_id)
VALUES ('creator2hazel856@gmail.com', '2hazel', '2daniel', '28080', :'courseta_var_creator_id_2') ON CONFLICT DO NOTHING;

INSERT INTO students (email, first_name, last_name, password, student_id)
VALUES ('studenthazel@gmail.com', 'studenthazel1', 'daniel', '28080', :'courseta_var_student_id_1') ON CONFLICT DO NOTHING;

INSERT INTO students (email, first_name, last_name, password, student_id)
VALUES ('studenthazel2@gmail.com', 'studenthazel2', 'daniel2', '280fs80', :'courseta_var_student_id_2') ON CONFLICT DO NOTHING;

INSERT INTO students (email, first_name, last_name, password, student_id)
VALUES ('studenthazel3@gmail.com', 'studenthazel3', 'daniel3', '2803s80', :'courseta_var_student_id_3') ON CONFLICT DO NOTHING;

INSERT INTO courses (title, description, review_count, creator_id)
VALUES ('new course', 'this is a new course', 0, :'courseta_var_creator_id_1') ON CONFLICT DO NOTHING;

INSERT INTO courses (title, description, review_count, creator_id)
VALUES ('blockchain course', 'this is a blockchain course', 0, :'courseta_var_creator_id_1') ON CONFLICT DO NOTHING;

INSERT INTO courses (title, description, review_count, creator_id)
VALUES ('fintech course', 'this is a fintech course', 0, :'courseta_var_creator_id_1') ON CONFLICT DO NOTHING;


SELECT enroll_student_to_course(:'courseta_var_student_id_1', 1);
SELECT enroll_student_to_course(:'courseta_var_student_id_1', 2);

SELECT enroll_student_to_course(:'courseta_var_student_id_2', 3);
-- SELECT enroll_student_to_course(:'courseta_var_student_id_2', 1);

SELECT enroll_student_to_course(:'courseta_var_student_id_3', 2);
SELECT enroll_student_to_course(:'courseta_var_student_id_3', 3);



INSERT INTO lessons (title, lesson_id, course_id)
VALUES ('first lesson', :'courseta_var_lesson_id_1', :'courseta_var_course_id_1');

INSERT INTO lessons (title, lesson_id, course_id)
VALUES ('second lesson', :'courseta_var_lesson_id_2', :'courseta_var_course_id_1');


INSERT INTO quizzes (assessment_id, quiz_id, lesson_id, pass_score, description)
VALUES (:'courseta_var_quiz_id_1', :'courseta_var_quiz_id_1', :'courseta_var_lesson_id_1', 50, 'a test quiz');

INSERT INTO quizzes (assessment_id, quiz_id, lesson_id, pass_score, description)
VALUES (:'courseta_var_quiz_id_2', :'courseta_var_quiz_id_2', :'courseta_var_lesson_id_2', 70, 'a second test quiz');


INSERT INTO questions (assessment_id, question_id, question_text, points)
VALUES (:'courseta_var_quiz_id_1', :'courseta_var_question_id_1', 'what is Abc in OOP?', 800);

INSERT INTO questions (assessment_id, question_id, question_text, points)
VALUES (:'courseta_var_quiz_id_1', :'courseta_var_question_id_2', 'how many sides has a square?', 500);


INSERT INTO answers (answer_id, answer_text, is_correct, question_id)
VALUES (:'courseta_var_answer_id_1', 'abstract base class', true, :'courseta_var_question_id_1');

INSERT INTO answers (answer_id, answer_text, is_correct, question_id)
VALUES (:'courseta_var_answer_id_2', 'all base concepts', true, :'courseta_var_question_id_1');

INSERT INTO answers (answer_id, answer_text, is_correct, question_id)
VALUES (:'courseta_var_answer_id_3', 'abstract base classes', true, :'courseta_var_question_id_1');

INSERT INTO answers (answer_id, answer_text, is_correct, question_id)
VALUES (:'courseta_var_answer_id_6', 'abstract base class', true, :'courseta_var_question_id_1');


INSERT INTO answers (answer_id, answer_text, is_correct, question_id)
VALUES (:'courseta_var_answer_id_4', '4 sides', false, :'courseta_var_question_id_2');

INSERT INTO answers (answer_id, answer_text, is_correct, question_id)
VALUES (:'courseta_var_answer_id_5', '0 sides', true, :'courseta_var_question_id_2');


INSERT INTO exams (assessment_id, exam_id, pass_score, description, duration, start_date, end_date, assessment_type)
VALUES (:'courseta_var_exam_id_1', :'courseta_var_exam_id_1', 80, 'an exam quiz', 200,
'2020-08-04 08:03:37.808+02'::TIMESTAMPTZ, '2020-08-04 15:03:37.808+02'::TIMESTAMPTZ, 'exam');


-- DELETE FROM questions WHERE question_id = :'courseta_var_question_id_2';

-- \echo 'checking the quizzes.question_count after deleting a question';
-- SELECT COUNT(*) FROM questions;
-- SELECT question_count, description, total_points FROM quizzes;

-- ASSESSMENT FLOW FOR STUDENT 1 ON QUIZ 1
\echo 'attempting assessments';
INSERT INTO students__assessments (student_id, assessment_id, submitted_at)
VALUES (:'courseta_var_student_id_1', :'courseta_var_quiz_id_1', :'courseta_var_submission_time'::timestamp);

\echo 'checking students__assessments.total_points_accumulated before attempting an assessment';
SELECT * FROM students__assessments WHERE student_id = :'courseta_var_student_id_1';

\echo 'answering questions';
INSERT INTO students__questions (student_id, question_id, answered_at)
VALUES (:'courseta_var_student_id_1', :'courseta_var_question_id_1', :'courseta_var_submission_time'::timestamp);

INSERT INTO students__questions (student_id, question_id, answered_at)
VALUES (:'courseta_var_student_id_1', :'courseta_var_question_id_2', :'courseta_var_submission_time'::timestamp);

\echo 'checking all attempts on questions:';
SELECT * FROM students__questions;

\echo 'selecting answers';
INSERT INTO students__answers (student_id, answer_id, question_id, selected_at)
VALUES
(:'courseta_var_student_id_1', :'courseta_var_answer_id_1', :'courseta_var_question_id_1', :'courseta_var_submission_time'::timestamp),
(:'courseta_var_student_id_1', :'courseta_var_answer_id_2', :'courseta_var_question_id_1', :'courseta_var_submission_time'::timestamp),
(:'courseta_var_student_id_1', :'courseta_var_answer_id_3', :'courseta_var_question_id_1', :'courseta_var_submission_time'::timestamp),
(:'courseta_var_student_id_1', :'courseta_var_answer_id_6', :'courseta_var_question_id_1', :'courseta_var_submission_time'::timestamp),

(:'courseta_var_student_id_1', :'courseta_var_answer_id_5', :'courseta_var_question_id_2', :'courseta_var_submission_time'::timestamp);

\echo 'true submission of an assessment';
UPDATE students__assessments
SET waiting = 'false'
WHERE student_id = :'courseta_var_student_id_1'
AND assessment_id = :'courseta_var_quiz_id_1'
AND submitted_at = :'courseta_var_submission_time'::timestamp;


\echo 'checking student points and rank after submission of an assessment';
SELECT * FROM students WHERE student_id = :'courseta_var_student_id_1';

\echo 'checking students__questions.points_accumulated after submission of an assessment';
SELECT * FROM students__questions WHERE student_id = :'courseta_var_student_id_1';

\echo 'checking students__assessments.total_points_accumulated after submission of an assessment';
SELECT * FROM students__assessments WHERE student_id = :'courseta_var_student_id_1';





-- ASSESSMENT FLOW FOR STUDENT 2 ON QUIZ 1
\echo 'attempting assessments';
INSERT INTO students__assessments (student_id, assessment_id, submitted_at)
VALUES (:'courseta_var_student_id_2', :'courseta_var_quiz_id_1', :'courseta_var_submission_time'::timestamp);

\echo 'checking students__assessments.total_points_accumulated before attempting an assessment';
2ELECT * FROM students__assessments WHERE student_id = :'courseta_var_student_id_2';

\echo 'answering questions';
INSERT INTO students__questions (student_id, question_id, answered_at)
VALUES (:'courseta_var_student_id_2', :'courseta_var_question_id_1', :'courseta_var_submission_time'::timestamp);

INSERT INTO students__questions (student_id, question_id, answered_at)
VALUES (:'courseta_var_student_id_2', :'courseta_var_question_id_2', :'courseta_var_submission_time'::timestamp);

\echo 'checking all attempts on questions:';
SELECT * FROM students__questions;

\echo 'selecting answers';
INSERT INTO students__answers (student_id, answer_id, question_id, selected_at)
VALUES
(:'courseta_var_student_id_2', :'courseta_var_answer_id_1', :'courseta_var_question_id_1', :'courseta_var_submission_time'::timestamp),
(:'courseta_var_student_id_2', :'courseta_var_answer_id_2', :'courseta_var_question_id_1', :'courseta_var_submission_time'::timestamp),
-- (:'courseta_var_student_id_2', :'courseta_var_answer_id_3', :'courseta_var_question_id_1', :'courseta_var_submission_time'::timestamp),
-- (:'courseta_var_student_id_2', :'courseta_var_answer_id_6', :'courseta_var_question_id_1', :'courseta_var_submission_time'::timestamp),

(:'courseta_var_student_id_2', :'courseta_var_answer_id_5', :'courseta_var_question_id_2', :'courseta_var_submission_time'::timestamp);

\echo 'true submission of an assessment';
UPDATE students__assessments
SET waiting = 'false'
WHERE student_id = :'courseta_var_student_id_2'
AND assessment_id = :'courseta_var_quiz_id_1'
AND submitted_at = :'courseta_var_submission_time'::timestamp;


\echo 'checking student points and rank after submission of an assessment';
SELECT * FROM students WHERE student_id = :'courseta_var_student_id_2';

\echo 'checking students__questions.points_accumulated after submission of an assessment';
SELECT * FROM students__questions WHERE student_id = :'courseta_var_student_id_2';

\echo 'checking students__assessments.total_points_accumulated after submission of an assessment';
SELECT * FROM students__assessments WHERE student_id = :'courseta_var_student_id_2';

-- \echo 'TODO: e.g student2 is supposed to have the same progress as student 1 since they attempted the same quizzes on the same courses but no';
