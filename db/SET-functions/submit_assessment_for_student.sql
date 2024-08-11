DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up the SET function to submit assessment.';

  CREATE OR REPLACE PROCEDURE submit_assessment_for_student(p_student_id UUID, p_assessment_id UUID,
  p_questions INT[], p_answers JSONB, p_submission_time TIMESTAMPTZ)
  LANGUAGE plpgsql
  AS
  $block1$
  DECLARE
  question_id_                INT;
  p_answer                  JSONB;
  p_answer_count INT    DEFAULT 0;
  p_answer_time_computed      INT;
  student_enroll_occurrence   INT;
  corresponding_course_id    UUID;
  BEGIN
    -- first, assume that this is a quiz submission
    SELECT INTO corresponding_course_id courses.course_id
    FROM courseta.quizzes
    JOIN courseta.lessons USING (lesson_id)
    JOIN courseta.courses USING (course_id)
    WHERE quizzes.quiz_id = p_assessment_id;

    -- then, assume that this is an exam submission
    IF corresponding_course_id IS NULL THEN
      SELECT INTO corresponding_course_id courses.course_id
      FROM courseta.exams
      JOIN courseta.lessons USING (course_id)
      WHERE exams.exam_id = p_assessment_id;
    END IF;

    SELECT INTO student_enroll_occurrence COUNT(*) FROM courseta.students__courses
    WHERE students__courses.student_id = p_student_id
    AND students__courses.course_id = corresponding_course_id;

    IF student_enroll_occurrence <= 1 THEN
      RAISE EXCEPTION 'only enrolled users can attempt an assessment.';
    END IF;

    --unit of work: assessment submission
    INSERT INTO courseta.students__assessments(student_id, assessment_id, submitted_at)
    VALUES (p_student_id, p_assessment_id, p_submission_time);

    -- go through a list of the questions
    FOR question_idx IN 1 .. array_length(p_questions, 1) LOOP
      question_id_ := p_questions[question_idx];
      INSERT INTO courseta.students__questions(student_id, question_id, answered_at)
      VALUES (p_student_id, question_id_, p_submission_time);

      -- go through a list of the answers
      FOR p_answer IN SELECT * FROM jsonb_array_elements(p_answers) LOOP
        IF (p_answer->>'question_id')::INT = question_id_ THEN
          p_answer_count := (p_answer_count + 1000);
          p_answer_time_computed := EXTRACT (EPOCH FROM p_submission_time::TIMESTAMPTZ) + p_answer_count;
          INSERT INTO courseta.students__answers(student_id, answer_id, question_id, selected_at, updated_milliseconds)
          VALUES (p_student_id, (p_answer->>'answer_id')::INT, question_id_, p_submission_time::TIMESTAMPTZ, p_answer_time_computed);
        END IF;
      END LOOP;
    END LOOP;

    -- submitting programatically.
    -- NOTE: setting false is what triggers the completion, setting back to true is my little trick to make the assessment available for retake

    UPDATE courseta.students__assessments SET waiting = 'false'
    WHERE student_id = p_student_id
    AND assessment_id = p_assessment_id
    AND submitted_at = p_submission_time;

    UPDATE courseta.students__assessments SET waiting = 'true'
    WHERE student_id = p_student_id
    AND assessment_id = p_assessment_id
    AND submitted_at = p_submission_time;

  EXCEPTION
    WHEN unique_violation THEN
      RAISE NOTICE '%', SQLERRM;
      RAISE NOTICE 'there is a duplicate entry in the submission flow. submission not recorded. rolling back...';
      ROLLBACK;
    WHEN foreign_key_violation THEN
      RAISE NOTICE '%', SQLERRM;
      RAISE NOTICE 'some of the IDs are referencing other columns that do not exist. rolling back...';
      ROLLBACK;
    WHEN others THEN
      RAISE NOTICE '%', SQLERRM;
      RAISE NOTICE 'the above exception occurred while trying to submit assessment. rolling back...';
      ROLLBACK;

  END;
  $block1$;

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up the update_creator_pass function.';
END;
$block$ LANGUAGE PLPGSQL;
