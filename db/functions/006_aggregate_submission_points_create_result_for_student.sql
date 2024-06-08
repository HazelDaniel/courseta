DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update on the students.points column.';

  CREATE OR REPLACE FUNCTION agg_assessment_submission_points_to_student () RETURNS TRIGGER AS
  $block1$
  DECLARE
    retake_points          INT;
    tot_question_points    INT;
    gen_result_id          UUID;
  BEGIN
    SELECT INTO retake_points COALESCE(SUM(total_points_accumulated), 0) FROM students__assessments WHERE
    student_id = NEW.student_id AND assessment_id = NEW.assessment_id
    AND submitted_at <> NEW.submitted_at;

    UPDATE students SET points = (points - retake_points)
    WHERE student_id = NEW.student_id; -- deducting existing retake points from the students points

    SELECT INTO tot_question_points COALESCE(SUM(points_accumulated), 0) FROM students__questions
    JOIN questions USING (question_id)
    WHERE assessment_id = NEW.assessment_id AND answered_at = NEW.submitted_at
    AND student_id = NEW.student_id;

    NEW.total_points_accumulated = tot_question_points;
    UPDATE students SET points = points + tot_question_points WHERE student_id = NEW.student_id;
    -- we should create a corresponding assessment result here
    gen_result_id := insert_equiv_assessment_result(NEW.student_id, NEW.assessment_id, NEW.submitted_at);
    CALL update_score_on_assessment_result(NEW.student_id, NEW.assessment_id, NEW.submitted_at, gen_result_id);

    RETURN NEW;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update on the assessment_results.score.';

  CREATE OR REPLACE PROCEDURE update_score_on_assessment_result
  (student_id UUID, assessment_id UUID, time_attempted TIMESTAMPTZ, result_id UUID)
  LANGUAGE PLPGSQL AS
  $block2$
  DECLARE
    acc_points SMALLINT;
    tot_points      INT;
    res             INT;
  BEGIN
    SELECT INTO acc_points total_points_accumulated
    FROM students__assessments WHERE submitted_at = time_attempted
    AND student_id = student_id AND assessment_id = assessment_id;

    SELECT INTO tot_points total_points
    FROM assessments WHERE assessment_id = assessment_id;

    res := ((acc_points / tot_points) * 100)::INT;

    UPDATE assessment_results SET score = res WHERE attempted_at = time_attempted
    AND student_id = student_id AND assessment_id = assessment_id;
  END;
  $block2$;

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update on the assessment_results.score.';

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for creation of the assessment_results.';

  CREATE OR REPLACE FUNCTION insert_equiv_assessment_result
  (student_id UUID, assessment_id UUID, time_attempted TIMESTAMPTZ)
  RETURNS UUID
  AS
  $block2$
  DECLARE
    res           UUID;
  BEGIN
    INSERT INTO assessment_results (student_id, assessment_id, submitted_at)
    VALUES (student_id, assessment_id, time_attempted) RETURNING asessment_result_id INTO res;

    RETURN res;
  END;
  $block2$ LANGUAGE PLPGSQL;

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for creation of the assessment_results.';

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update on the students.points column.';

END
$block$ LANGUAGE PLPGSQL;