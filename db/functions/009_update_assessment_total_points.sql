DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update of the assessment.total_points.';

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for addition to the assessment.total_points.';

  CREATE OR REPLACE FUNCTION add_points_and_question_count_to_assessment () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CALL add_question_equiv_assessment_points_and_count(NEW.assessment_id, NEW.points);
		RETURN NEW;
  END;
  $block1$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE PROCEDURE add_question_equiv_assessment_points_and_count
  (assessment_id_ UUID, new_point INT) LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    UPDATE assessments SET total_points = (total_points + new_point),
    question_count = (question_count + 1)
		WHERE assessments.assessment_id = assessment_id_;
  END;
  $block2$;

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for addition to the assessment.total_points.';


  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for subtraction from the assessment.total_points.';

  CREATE OR REPLACE FUNCTION remove_points_and_question_count_from_assessment () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CALL subtract_question_equiv_assessment_points_and_count(OLD.assessment_id, OLD.points);
		RETURN OLD;
  END;
  $block1$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE PROCEDURE subtract_question_equiv_assessment_points_and_count
  (assessment_id_ UUID, old_point INT) LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    UPDATE assessments SET total_points = (total_points + old_point),
    question_count = (question_count - 1)
		WHERE assessments.assessment_id = assessment_id_;
  END;
  $block2$;

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for subtraction from the assessment.total_points.';

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update of the assessment.total_points.';
END
$block$ LANGUAGE PLPGSQL;
