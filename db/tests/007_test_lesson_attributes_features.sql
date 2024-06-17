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

\set courseta_var_lesson_content_id_1 1
\set courseta_var_lesson_content_id_2 2
\set courseta_var_lesson_content_id_3 3

\set courseta_var_quiz_id_1 a69c1374-d4af-4644-a791-fd8b6601aa8c
\set courseta_var_quiz_id_2 b69c1374-d4af-4644-a791-fd8b6601aa8c

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

INSERT INTO lesson_contents (lesson_content_id, title, href, lesson_id)
VALUES (1, 'exploring the metaverse', 'www.google.com?search=exploring%20the%20metaverse', :'courseta_var_lesson_id_1'),
(2, 'finding your github repository', 'www.google.com?search=finding%your%20github%20repo', :'courseta_var_lesson_id_1'),
(3, 'some resources to read about BTC', 'www.google.com?search=what%is%20BTC', :'courseta_var_lesson_id_1');


INSERT INTO quizzes (assessment_id, quiz_id, lesson_id, pass_score, description)
VALUES (:'courseta_var_quiz_id_1', :'courseta_var_quiz_id_1', :'courseta_var_lesson_id_1', 50, 'a test quiz');

INSERT INTO quizzes (assessment_id, quiz_id, lesson_id, pass_score, description)
VALUES (:'courseta_var_quiz_id_2', :'courseta_var_quiz_id_2', :'courseta_var_lesson_id_2', 70, 'a second test quiz');


\echo '=====LESSONS-b======';
SELECT * FROM lessons;


-- DELETE FROM lessons WHERE lesson_id = :'courseta_var_lesson_id_1';

\echo '=====LESSONS-c======';
SELECT * FROM lessons;



DELETE FROM quizzes WHERE quiz_id = :'courseta_var_quiz_id_2';

\echo '=====LESSONS-d======';
SELECT * FROM lessons;

UPDATE lesson_contents SET duration = 100
WHERE lesson_content_id = 1;

\echo 'testing the course.course_length attribute after updating a lesson_content';
SELECT * FROM courses;


\echo 'testing the course.course_length attribute after removing a lesson content';
SELECT * FROM courses;
