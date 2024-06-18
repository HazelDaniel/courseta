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
    RETURN QUERY(
      WITH results_with_no_retake (
        r_number, exam_id, date_completed, score
      ) AS (
        SELECT ROW_NUMBER() OVER (PARTITION BY assessment_id ORDER BY attempted_at DESC), exams.exam_id,
        assessments_results.attempted_at date_completed, assessments_results.score
        FROM assessments_results
        JOIN exams USING (assessment_id)
        WHERE assessments_results.student_id = student_id_
      )
      SELECT rwnt.exam_id, rwnt.date_completed, rwnt.score
      FROM results_with_no_retake rwnt WHERE r_number = 1
    );
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_student_exam_results function.';
END;
$block$ LANGUAGE PLPGSQL;
