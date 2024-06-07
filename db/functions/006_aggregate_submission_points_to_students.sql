DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update on the students.points column.';

  CREATE OR REPLACE FUNCTION agg_assessment_submission_points_to_student () RETURNS TRIGGER AS
  $block1$
  DECLARE
    retake_count           INT;
    retake_points          INT;
    tot_question_points    INT;
  BEGIN
    SELECT INTO retake_count COUNT(*) FROM students__assessments
    WHERE student_id = NEW.student_id AND assessment_id = NEW.assessment_id
    AND submitted_at <> NEW.submitted_at;

    CASE -- deducting existing retake points from the students points
      WHEN retake_count > 0 THEN
      SELECT INTO retake_points SUM(total_points_accumulated) FROM students__assessments WHERE
      student_id = NEW.student_id AND assessment_id = NEW.assessment_id
      AND submitted_at <> NEW.submitted_at;


      UPDATE students SET points = (points - retake_points)
      WHERE student_id = NEW.student_id;
    END CASE;

    SELECT INTO tot_question_points SUM(points_accumulated) FROM students__questions WHERE
    assessment_id = NEW.assessment_id AND answered_at = NEW.submitted_at;

    NEW.total_points_accumulated = tot_question_points;
    UPDATE students SET points = points + tot_question_points WHERE student_id = NEW.student_id;

    RETURN NEW;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update on the students.points column.';

END
$block$ LANGUAGE PLPGSQL;