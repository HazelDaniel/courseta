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
    SELECT INTO retake_points COALESCE(SUM(total_points_accumulated), 0) FROM students__assessments
		WHERE students__assessments.student_id = NEW.student_id
		AND students__assessments.assessment_id = NEW.assessment_id
    AND students__assessments.submitted_at <> NEW.submitted_at;

    UPDATE students SET points = (points - retake_points)
    WHERE students.student_id = NEW.student_id; -- deducting existing retake points from the students points

    SELECT INTO tot_question_points COALESCE(SUM(points_accumulated), 0) FROM students__questions
    JOIN questions USING (question_id)
    WHERE questions.assessment_id = NEW.assessment_id AND questions.answered_at = NEW.submitted_at
    AND students__questions.student_id = NEW.student_id;

    NEW.total_points_accumulated = tot_question_points;
    UPDATE students SET points = points + tot_question_points
		WHERE students.student_id = NEW.student_id;
    -- we should create a corresponding assessment result here
    gen_result_id := insert_equiv_assessment_result(NEW.student_id, NEW.assessment_id, NEW.submitted_at);
    CALL update_score_on_assessment_result(NEW.student_id, NEW.assessment_id, NEW.submitted_at, gen_result_id);

    RETURN NEW;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update on the students.points column.';

END
$block$ LANGUAGE PLPGSQL;
