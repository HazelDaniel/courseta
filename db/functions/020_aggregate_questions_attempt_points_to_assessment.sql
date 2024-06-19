DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update on the students__questions.points_accumulated column.';

  CREATE OR REPLACE FUNCTION agg_questions_attempt_points_to_submission () RETURNS TRIGGER AS
  $block1$
  DECLARE
    equiv_assessment_id             UUID;
    last_answers_agg_points          INT;
    debug_answer_record                RECORD;
  BEGIN
    IF NEW.points_accumulated = OLD.points_accumulated THEN
      RETURN NEW; -- don't do anything further if the update is not on the points_accumulated field
    END IF;


    SELECT INTO equiv_assessment_id assessments.assessment_id
    FROM students__questions
    JOIN questions USING (question_id)
    JOIN assessments USING (assessment_id)
    WHERE students__questions.question_id = NEW.question_id;


    -- the last question answered will have accumulated all the points from all the questions and set it on the corresponding assessment submission
    WITH last_answers_agg_list AS (
    SELECT ROW_NUMBER() OVER (PARTITION BY question_id ORDER BY updated_milliseconds DESC), points_gained
    FROM students__answers
    JOIN students__questions USING (question_id)
    JOIN questions USING (question_id)
    WHERE students__answers.student_id = NEW.student_id
    AND students__answers.selected_at = NEW.answered_at
    AND questions.assessment_id = equiv_assessment_id
    )

    SELECT INTO last_answers_agg_points COALESCE(SUM(points_gained), 0)
    FROM last_answers_agg_list
    WHERE row_number = 1;

    UPDATE courseta.students__assessments
    SET total_points_accumulated = last_answers_agg_points
		WHERE students__assessments.student_id = NEW.student_id
    AND students__assessments.submitted_at = NEW.answered_at
    AND students__assessments.assessment_id = equiv_assessment_id;

    RETURN NEW;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update on the students__questions.points_accumulated column.';

END
$block$ LANGUAGE PLPGSQL;

