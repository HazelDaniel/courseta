DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for executing submission effect.';

  CREATE OR REPLACE FUNCTION p_03_run_submission_effect () RETURNS TRIGGER AS
  $block1$
  DECLARE
    tot_points_agg        INT DEFAULT 0;
    gen_result_id                  UUID;
  BEGIN
    -- EFFECT 1: total_points_accumulated field update on students__assessments
    SELECT INTO tot_points_agg COALESCE(SUM(points_accumulated), 0)
    FROM courseta.students__questions
    WHERE students__questions.assessment_id = NEW.assessment_id
    AND students__questions.student_id = NEW.student_id
    AND students__questions.answered_at = NEW.submitted_at;

    UPDATE students__assessments SET
    total_points_accumulated = tot_points_agg
    WHERE students__assessments.assessment_id = NEW.assessment_id
    AND students__assessments.submitted_at = NEW.submitted_at;

    -- RAISE EXCEPTION 'total points accumulated on this submission is %', tot_points_agg;

    -- EFFECT 2a: points field update on students
    -- EFFECT 2b: result generation and score update on assessment_results
    PERFORM p_02_deduct_student_existing_points(NEW.student_id, NEW.assessment_id, NEW.submitted_at);


    UPDATE students SET points = points + tot_points_agg
		WHERE students.student_id = NEW.student_id;


    gen_result_id := p_02_upsert_equiv_assessment_result(NEW.student_id, NEW.assessment_id, NEW.submitted_at, 'failed'::courseta.ASSESSMENT_RESULT_STATUS_TYPE);
    CALL p_01_update_score_on_assessment_result(NEW.student_id, NEW.assessment_id, NEW.submitted_at, gen_result_id);

    -- EFFECT 3: progress field update on students__courses
    CALL p_01_update_progress_for_course(NEW.assessment_id, NEW.student_id, NEW.submitted_at);

    tot_points_agg := 0;
    gen_result_id := NULL;

    RETURN NEW;
  END;
  $block1$ LANGUAGE PLPGSQL;

RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for executing submission effect.';

END
$block$ LANGUAGE PLPGSQL;
