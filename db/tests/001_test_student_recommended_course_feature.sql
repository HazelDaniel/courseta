\x
\echo '===TEST: (FEATURE) recommended courses for student===';
\set courseta_var_creator_id_1 2aac9187-e2e9-4326-9c0b-920bfa0143b4
\set courseta_var_creator_id_2 47621eb8-08e0-42d4-87cb-8efac5676290
\set courseta_var_student_id_1 9ae767db-0a13-4cea-8d1f-99c25fa831f6
\set courseta_var_student_id_2 a69c1374-d4ef-4644-a791-fd8b6601aa8c

INSERT INTO creators (email, first_name, last_name, password, creator_id)
VALUES ('hazel856@gmail.com', 'hazel', 'daniel', '8080', :'courseta_var_creator_id_1') ON CONFLICT DO NOTHING;

INSERT INTO creators (email, first_name, last_name, password, creator_id)
VALUES ('creator2hazel856@gmail.com', '2hazel', '2daniel', '28080', :'courseta_var_creator_id_2') ON CONFLICT DO NOTHING;

INSERT INTO students (email, first_name, last_name, password, student_id)
VALUES ('studenthazel@gmail.com', 'studenthazel1', 'daniel', '28080', :'courseta_var_student_id_1') ON CONFLICT DO NOTHING;

INSERT INTO students (email, first_name, last_name, password, student_id)
VALUES ('studenthazel2@gmail.com', 'studenthazel2', 'daniel2', '280fs80', :'courseta_var_student_id_2') ON CONFLICT DO NOTHING;

TRUNCATE TABLE courseta.courses CASCADE;

INSERT INTO courses (title, description, review_count, creator_id)
VALUES ('new course', 'this is a new course', 0, :'courseta_var_creator_id_1') ON CONFLICT DO NOTHING;

INSERT INTO courses (title, description, review_count, creator_id)
VALUES ('blockchain course', 'this is a blockchain course', 0, :'courseta_var_creator_id_1') ON CONFLICT DO NOTHING;

INSERT INTO courses (title, description, review_count, creator_id)
VALUES ('fintech course', 'this is a fintech course', 0, :'courseta_var_creator_id_1') ON CONFLICT DO NOTHING;

INSERT INTO students__courses(student_id, course_id)
VALUES (:'courseta_var_student_id_1', 1) ON CONFLICT DO NOTHING;

INSERT INTO students__courses(student_id, course_id)
VALUES (:'courseta_var_student_id_1', 2) ON CONFLICT DO NOTHING;

INSERT INTO students__courses(student_id, course_id)
VALUES (:'courseta_var_student_id_2', 3) ON CONFLICT DO NOTHING;

UPDATE courses SET tags = '{course, programming}'::TEXT[] WHERE course_id = 1;
UPDATE courses SET tags = '{course}'::TEXT[] WHERE course_id = 3;
UPDATE courses SET tags = '{course, blockchain}'::TEXT[] WHERE course_id = 2;


SELECT review_course_for_student(:'courseta_var_student_id_1', 1, '4');
SELECT review_course_for_student(:'courseta_var_student_id_1', 2, '4');
SELECT review_course_for_student(:'courseta_var_student_id_2', 2, '4');

SELECT * FROM courses;
SELECT * FROM creators;
SELECT * FROM students;

SELECT * FROM get_recommended_courses_for_student(:'courseta_var_student_id_1');
SELECT * FROM get_recommended_courses_for_student(:'courseta_var_student_id_2');
\echo '===TEST: (FEATURE) DONE recommended courses for student===';
