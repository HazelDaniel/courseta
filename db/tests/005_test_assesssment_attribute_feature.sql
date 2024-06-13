-- __test-ignore__
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
\set courseta_var_answer_2 2


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

\echo 'checking all assessments';
SELECT assessment_id, description FROM ONLY assessments;

INSERT INTO questions (assessment_id, question_id, question_text, points)
VALUES (:'courseta_var_quiz_id_1', :'courseta_var_question_id_1', 'what is Abc in OOP?', 150);

INSERT INTO questions (assessment_id, question_id, question_text, points)
VALUES (:'courseta_var_quiz_id_1', :'courseta_var_question_id_2', 'how many sides has a square?', 250);

-- SELECT * FROM quizzes;


-- DELETE FROM quizzes WHERE quiz_id = :'courseta_var_quiz_id_2';


-- DELETE FROM questions WHERE question_id = :'courseta_var_question_id_1';

-- \echo 'checking the quizzes.total_points after deleting a question';
-- SELECT * FROM quizzes;

-- DELETE FROM questions WHERE question_id = :'courseta_var_question_id_1';

-- \echo 'checking the quizzes.total_points after performing a wrong question deletion';
-- SELECT * FROM quizzes;

\echo 'checking the quizzes.total_points before updating a question';
SELECT description, total_points, question_count FROM quizzes;

UPDATE questions SET points = 100
WHERE question_id = :'courseta_var_question_id_2';

\echo 'checking the quizzes.total_points after updating a question';
SELECT description, total_points, question_count FROM quizzes;

DELETE FROM questions WHERE question_id = :'courseta_var_question_id_2';

\echo 'checking the quizzes.question_count after deleting a question';
SELECT COUNT(*) FROM questions;
SELECT question_count, description, total_points FROM quizzes;


INSERT INTO exams (assessment_id, exam_id, pass_score, description, duration, start_date, end_date, assessment_type)
VALUES (:'courseta_var_exam_id_1', :'courseta_var_exam_id_1', 80, 'an exam quiz', 200,
'2020-08-04 04:03:37.808+02'::TIMESTAMPTZ, '2020-08-04 05:03:37.808+02'::TIMESTAMPTZ, 'exam');

\echo 'checking the exams.assessment_type after the insertion of an exam';
SELECT exam_id, description, assessment_type FROM exams;

\echo 'checking all assessments';
SELECT assessment_id, description FROM ONLY assessments;

DELETE FROM lessons WHERE lesson_id = :'courseta_var_lesson_id_1';

\echo 'checking the remaining quizzes after deleting a lesson';
SELECT description, total_points, question_count FROM quizzes;

\echo 'checking the remaining assessments after deleting a lesson';
SELECT * FROM ONLY assessments;
