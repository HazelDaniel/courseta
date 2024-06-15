DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_student_quiz_results function ...';

  CREATE OR REPLACE FUNCTION get_student_quiz_results (student_id_ UUID) RETURNS
  TABLE (
    quiz_id UUID,
    date_completed TIMESTAMPTZ,
    course_id BIGINT,
    score SMALLINT
  ) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT
    quizzes.quiz_id, assessments_results.attempted_at date_completed, courses.course_id, assessments_results.score
    FROM assessments_results
    JOIN quizzes USING (assessment_id)
    JOIN lessons USING (lesson_id)
    JOIN courses USING (course_id)
    WHERE assessments_results.student_id = student_id_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_student_quiz_results function.';
END;
$block$ LANGUAGE PLPGSQL;

