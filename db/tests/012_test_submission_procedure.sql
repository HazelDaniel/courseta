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
\set courseta_var_question_id_3 3
\set courseta_var_question_id_4 4

\set courseta_var_answer_id_1 1
\set courseta_var_answer_id_2 2

\set courseta_var_answer_id_3 3
\set courseta_var_answer_id_4 4
\set courseta_var_answer_id_5 5
\set courseta_var_answer_id_6 6

\set courseta_var_answer_id_7 7
\set courseta_var_answer_id_8 8
\set courseta_var_answer_id_9 9
\set courseta_var_answer_id_10 10
\set courseta_var_answer_id_11 11


\set courseta_var_submission_time '2024-06-04 15:03:37.808+02'
\set courseta_var_retake_time '2024-07-04 15:03:37.200+02'
\set courseta_var_retake_time2 '2024-09-04 16:03:37.902+02'


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
SELECT enroll_student_to_course(:'courseta_var_student_id_2', 1);

SELECT enroll_student_to_course(:'courseta_var_student_id_3', 2);
SELECT enroll_student_to_course(:'courseta_var_student_id_3', 3);



INSERT INTO lessons (title, lesson_id, course_id)
VALUES ('first lesson', :'courseta_var_lesson_id_1', :'courseta_var_course_id_1');

INSERT INTO lessons (title, lesson_id, course_id)
VALUES ('second lesson', :'courseta_var_lesson_id_2', :'courseta_var_course_id_1');


INSERT INTO quizzes (assessment_id, quiz_id, lesson_id, pass_score, description)
VALUES (:'courseta_var_quiz_id_1', :'courseta_var_quiz_id_1', :'courseta_var_lesson_id_1', 50, 'a test quiz');

-- INSERT INTO quizzes (assessment_id, quiz_id, lesson_id, pass_score, description)
-- VALUES (:'courseta_var_quiz_id_2', :'courseta_var_quiz_id_2', :'courseta_var_lesson_id_2', 70, 'a second test quiz');

-- INSERT INTO exams (assessment_id, exam_id, pass_score, description)
-- VALUES (:'courseta_var_quiz_id_2', :'courseta_var_quiz_id_2', 70, 'a second test quiz');


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
VALUES (:'courseta_var_exam_id_1', :'courseta_var_exam_id_1', 80, 'an exam quiz on blockchain', 200,
'2020-08-04 08:03:37.808+02'::TIMESTAMPTZ, '2020-08-04 15:03:37.808+02'::TIMESTAMPTZ, 'exam');

INSERT INTO questions (assessment_id, question_id, question_text, points)
VALUES (:'courseta_var_exam_id_1', :'courseta_var_question_id_3', 'what is blockchain', 880);

INSERT INTO questions (assessment_id, question_id, question_text, points)
VALUES (:'courseta_var_exam_id_1', :'courseta_var_question_id_4', 'what languages can be used to program a blockchain', 920);


INSERT INTO answers (answer_id, answer_text, is_correct, question_id)
VALUES (:'courseta_var_answer_id_7', 'blockchain is a network of transactions called blocks that are created securely using cryptography', true, :'courseta_var_question_id_3');

INSERT INTO answers (answer_id, answer_text, is_correct, question_id)
VALUES (:'courseta_var_answer_id_8', 'i have no idea', false, :'courseta_var_question_id_3');

INSERT INTO answers (answer_id, answer_text, is_correct, question_id)
VALUES (:'courseta_var_answer_id_9', 'a chain of blocks', false, :'courseta_var_question_id_3');

INSERT INTO answers (answer_id, answer_text, is_correct, question_id)
VALUES (:'courseta_var_answer_id_10', 'rust', true, :'courseta_var_question_id_4');

INSERT INTO answers (answer_id, answer_text, is_correct, question_id)
VALUES (:'courseta_var_answer_id_11', 'bash', false, :'courseta_var_question_id_4');


-- ASSESSMENT FLOW FOR STUDENT 1 ON QUIZ 1 (NEW METHOD)
\echo 'QUIZ SUBMISSION';
CALL submit_assessment_for_student(
    :'courseta_var_student_id_1'::UUID,
    :'courseta_var_quiz_id_1'::UUID,
    ARRAY[:courseta_var_question_id_1, :courseta_var_question_id_2]::INT[],
    (
        '[{"question_id": ' || :'courseta_var_question_id_1' || ', "answer_id": ' || :'courseta_var_answer_id_1' || '}, ' ||
        '{"question_id": ' || :'courseta_var_question_id_1' || ', "answer_id": ' || :'courseta_var_answer_id_3' || '}, ' ||
        '{"question_id": ' || :'courseta_var_question_id_1' || ', "answer_id": ' || :'courseta_var_answer_id_2' || '}, ' ||
        '{"question_id": ' || :'courseta_var_question_id_1' || ', "answer_id": ' || :'courseta_var_answer_id_6' || '}, ' ||
        '{"question_id": ' || :'courseta_var_question_id_2' || ', "answer_id": ' || :'courseta_var_answer_id_5' || '}]'
    )::JSONB,
    :'courseta_var_submission_time'::timestamptz
);

\echo 'EXAM SUBMISSION';

CALL submit_assessment_for_student(
    :'courseta_var_student_id_1'::UUID,
    :'courseta_var_exam_id_1'::UUID,
    ARRAY[:courseta_var_question_id_3, :courseta_var_question_id_4]::INT[],  -- Use an array for questions
    (
        '[{"question_id": ' || :'courseta_var_question_id_3' || ', "answer_id": ' || :'courseta_var_answer_id_8' || '}, ' ||
        '{"question_id": ' || :'courseta_var_question_id_4' || ', "answer_id": ' || :'courseta_var_answer_id_10' || '}]'
    )::JSONB,  -- Properly constructed JSONB
    :'courseta_var_submission_time'::timestamptz
);

\echo 'EXAM RE-SUBMISSION';

CALL submit_assessment_for_student(
    :'courseta_var_student_id_1'::UUID,
    :'courseta_var_exam_id_1'::UUID,
    ARRAY[:courseta_var_question_id_3, :courseta_var_question_id_4]::INT[],  -- Use an array for questions
    (
        '[{"question_id": ' || :'courseta_var_question_id_3' || ', "answer_id": ' || :'courseta_var_answer_id_7' || '}, ' ||
        '{"question_id": ' || :'courseta_var_question_id_4' || ', "answer_id": ' || :'courseta_var_answer_id_10' || '}]'
    )::JSONB,  -- Properly constructed JSONB
    :'courseta_var_retake_time'::timestamptz
);


\echo 'checking student points and rank after submission of an assessment';
SELECT * FROM students WHERE student_id = :'courseta_var_student_id_1';

\echo 'checking students__questions.points_accumulated after submission of an assessment';
SELECT * FROM students__questions WHERE student_id = :'courseta_var_student_id_1';

\echo 'checking students__assessments.total_points_accumulated after submission of an assessment';
SELECT * FROM students__assessments WHERE student_id = :'courseta_var_student_id_1';


\echo 'getting assessment results for a student';
SELECT * FROM get_student_exam_results(:'courseta_var_student_id_1');
SELECT * FROM get_student_quiz_results(:'courseta_var_student_id_1');
