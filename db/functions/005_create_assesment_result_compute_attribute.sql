DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update on the assessment_results.[attribute] column.';

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update on the assessment_results.score.';

  CREATE OR REPLACE PROCEDURE update_score_on_assessment_result
  (student_id_ UUID, assessment_id_ UUID, time_attempted TIMESTAMPTZ, result_id UUID)
  LANGUAGE PLPGSQL AS
  $block2$
  DECLARE
    acc_points SMALLINT;
    tot_points      INT;
    res             INT;
  BEGIN
    SELECT INTO acc_points total_points_accumulated
    FROM students__assessments
		WHERE students__assessments.submitted_at = time_attempted
    AND students__assessments.student_id = student_id_
		AND students__assessments.assessment_id = assessment_id_;

    SELECT INTO tot_points total_points
    FROM ONLY assessments WHERE assessments.assessment_id = assessment_id_;

    RAISE NOTICE '[debug]: accumulated points / total points = % / %', acc_points::NUMERIC , tot_points::NUMERIC;

    res := ((acc_points::NUMERIC / tot_points::NUMERIC) * 100);

    UPDATE assessments_results SET score = res
		WHERE attempted_at = time_attempted
    AND assessments_results.student_id = student_id_ AND assessments_results.assessment_id = assessment_id_;
  END;
  $block2$;

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update on the assessment_results.score.';

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for creation of assessment_result.';

  CREATE OR REPLACE FUNCTION upsert_equiv_assessment_result
  (student_id_ UUID, assessment_id_ UUID, time_attempted TIMESTAMPTZ)
  RETURNS UUID
  AS
  $block2$
  DECLARE
    res           UUID;
  BEGIN
    INSERT INTO assessments_results (student_id, assessment_id, attempted_at, score)
    VALUES (student_id_, assessment_id_, time_attempted, 0)
    ON CONFLICT DO NOTHING
    RETURNING assessment_result_id INTO res;

    RETURN res;
  END;
  $block2$ LANGUAGE PLPGSQL;

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for creation of assessment_result.';

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update on the assessment_results.[attribute] column.';

END
$block$ LANGUAGE PLPGSQL;
