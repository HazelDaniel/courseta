DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_student_exam_results function ...';

  CREATE OR REPLACE FUNCTION get_student_exam_results (student_id_ UUID) RETURNS
  TABLE (
    exam_id UUID,
    date_completed TIMESTAMPTZ,
    score SMALLINT
  ) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT
    exams.exam_id, assessments_results.attempted_at date_completed, assessments_results.score
    FROM assessments_results
    JOIN exams USING (assessment_id)
    WHERE assessments_results.student_id = student_id_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_student_exam_results function.';
END;
$block$ LANGUAGE PLPGSQL;
