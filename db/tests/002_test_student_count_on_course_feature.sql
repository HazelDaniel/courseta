-- __test-ignore__
\x
\set courseta_var_creator_id_1 2aac9187-e2e9-4326-9c0b-920bfa0143b4
\set courseta_var_creator_id_2 47621eb8-08e0-42d4-87cb-8efac5676290

\set courseta_var_student_id_1 9ae767db-0a13-4cea-8d1f-99c25fa831f6
\set courseta_var_student_id_2 a69c1374-d4ef-4644-a791-fd8b6601aa8c
\set courseta_var_student_id_3 a69c1304-d4af-4644-c082-fd8b6601aa8d

INSERT INTO creators (email, first_name, last_name, password, creator_id)
VALUES ('hazel856@gmail.com', 'hazel', 'daniel', '8080', :'courseta_var_creator_id_1') ON CONFLICT DO NOTHING;

INSERT INTO students (email, first_name, last_name, password, student_id)
VALUES ('studenthazel@gmail.com', 'studenthazel1', 'daniel', '28080', :'courseta_var_student_id_1') ON CONFLICT DO NOTHING;

INSERT INTO students (email, first_name, last_name, password, student_id)
VALUES ('studenthazel2@gmail.com', 'studenthazel2', 'daniel2', '280fs80', :'courseta_var_student_id_2') ON CONFLICT DO NOTHING;

INSERT INTO students (email, first_name, last_name, password, student_id)
VALUES ('studenthazel3@gmail.com', 'studenthazel3', 'daniel3', '380f380', :'courseta_var_student_id_3') ON CONFLICT DO NOTHING;

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
SELECT enroll_student_to_course(:'courseta_var_student_id_1', 3);

SELECT title, student_count, course_id FROM courses;

DELETE FROM students WHERE student_id = :'courseta_var_student_id_1';


SELECT title, student_count, course_id FROM courses;
SELECT COUNT(*) all_student_count FROM students;
