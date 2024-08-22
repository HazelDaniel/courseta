DO
$block$
BEGIN
  -- RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update of the assessment.total_points.';

  CREATE OR REPLACE PROCEDURE p_01_update_question_equiv_assessment_points
  (assessment_id_ UUID, new_point INT, assessment_type_ courseta.ASSESSMENT_TYPE) LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    CASE assessment_type_
      WHEN 'quiz' THEN
        UPDATE coursetae.quizzes SET total_points = (total_points + new_point)
        WHERE quizzes.assessment_id = assessment_id_;
      ELSE
        UPDATE courseta.exams SET total_points = (total_points + new_point)
        WHERE exams.assessment_id = assessment_id_;
    END CASE;
  END;
  $block2$;

  CREATE OR REPLACE FUNCTION p_02_update_points_and_question_count_on_assessment () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CALL p_01_update_question_equiv_assessment_points(NEW.assessment_id, NEW.points - OLD.points, NEW.assessment_type);
		RETURN NEW;
  END;
  $block1$ LANGUAGE PLPGSQL;

  -- RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for addition to the assessment.total_points.';

  CREATE OR REPLACE PROCEDURE p_01_add_question_equiv_assessment_points_and_count
  (assessment_id_ UUID, new_point INT, assessment_type_ courseta.ASSESSMENT_TYPE) LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    -- RAISE NOTICE '[debug]: adding with the new point: %', new_point;
    CASE assessment_type_
      WHEN 'quiz' THEN
        UPDATE courseta.quizzes SET total_points = (total_points + new_point),
        question_count = (question_count + 1)
        WHERE quizzes.assessment_id = assessment_id_;
      ELSE
        UPDATE courseta.exams SET total_points = (total_points + new_point),
        question_count = (question_count + 1)
        WHERE exams.assessment_id = assessment_id_;
    END CASE;
  END;
  $block2$;


  CREATE OR REPLACE FUNCTION p_02_add_points_and_question_count_to_assessment () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CALL p_01_add_question_equiv_assessment_points_and_count(NEW.assessment_id, NEW.points, NEW.assessment_type);
		RETURN NEW;
  END;
  $block1$ LANGUAGE PLPGSQL;

  -- RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for addition to the assessment.total_points.';


  -- RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for subtraction from the assessment.total_points.';

  CREATE OR REPLACE FUNCTION p_02_remove_points_and_question_count_from_assessment () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CALL p_01_subtract_question_equiv_assessment_points_and_count(OLD.assessment_id, OLD.points, OLD.assessment_type);
		RETURN OLD;
  END;
  $block1$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE PROCEDURE p_01_subtract_question_equiv_assessment_points_and_count
  (assessment_id_ UUID, old_point INT, assessment_type_ courseta.ASSESSMENT_TYPE) LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    CASE assessment_type_
      WHEN 'quiz' THEN
        UPDATE courseta.quizzes SET total_points = (total_points - old_point),
        question_count = (question_count - 1)
        WHERE quizzes.assessment_id = assessment_id_;
      ELSE
        UPDATE courseta.exams SET total_points = (total_points - old_point),
        question_count = (question_count - 1)
        WHERE exams.assessment_id = assessment_id_;
    END CASE;
  END;
  $block2$;


  -- RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for subtraction from the assessment.total_points.';

  ------------------------------------ DEBUGGING---------------------------------------------
  CREATE OR REPLACE VIEW debug_recent_question_attempt_points as (
  SELECT ROW_NUMBER () OVER (PARTITION BY students__questions.assessment_id ORDER BY answered_at DESC), points_accumulated, question_id, answered_at, quizzes.assessment_id FROM students__questions
  JOIN courseta.questions USING (question_id)
  JOIN courseta.quizzes ON (quizzes.assessment_id = questions.assessment_id)
  );

  -- RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update of the assessment.total_points.';
END
$block$ LANGUAGE PLPGSQL;
