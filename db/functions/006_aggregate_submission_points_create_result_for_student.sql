DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update on the students.points column.';

  CREATE OR REPLACE FUNCTION deduct_student_existing_points (student_id_ UUID, assessment_id_ UUID, submitted_at_ TIMESTAMPTZ) RETURNS VOID AS
  $block1$
  DECLARE
    retake_points          INT DEFAULT 0;
  BEGIN
    SELECT INTO retake_points total_points_accumulated
    FROM students__assessments
		WHERE students__assessments.student_id = student_id_
		AND students__assessments.assessment_id = assessment_id_
    AND students__assessments.submitted_at <> submitted_at_
    ORDER BY submitted_at DESC
    LIMIT 1;

    RAISE NOTICE '[debug]: retake points is %', retake_points;
    retake_points = COALESCE(retake_points, 0);


    UPDATE students SET points = (points - retake_points)
    WHERE students.student_id = student_id_; -- deducting existing retake points from the students points
  END;
  $block1$ LANGUAGE PLPGSQL;

    -- TODO: this should be triggered once or always re-computed otherwise
  CREATE OR REPLACE FUNCTION agg_assessment_submission_points_to_student () RETURNS TRIGGER AS
  $block1$
  DECLARE
    gen_result_id                   UUID;
  BEGIN
    IF NEW.waiting = OLD.waiting OR NEW.waiting = 'true' THEN
      RETURN NEW; -- don't do anything further if the assessment submission is not past the waiting state
    END IF;

    PERFORM deduct_student_existing_points(NEW.student_id, NEW.assessment_id, NEW.submitted_at);

    -- RAISE NOTICE '[debug]: WE ARE AGGREGATING STUDENT POINTS FROM ASSESSMENT SUBMISSION';

    UPDATE students SET points = points + NEW.total_points_accumulated
		WHERE students.student_id = NEW.student_id;
    -- we should create a corresponding assessment result here

    gen_result_id := upsert_equiv_assessment_result(NEW.student_id, NEW.assessment_id, NEW.submitted_at);
    CALL update_score_on_assessment_result(NEW.student_id, NEW.assessment_id, NEW.submitted_at, gen_result_id);

    RETURN NEW;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update on the students.points column.';

END
$block$ LANGUAGE PLPGSQL;
