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

\echo 'QUIZ SUBMISSION';
CALL create_course_for_creator(
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

