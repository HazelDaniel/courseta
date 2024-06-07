DO
$block$
BEGIN
--   RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for "students.points" update.';
--   CREATE OR REPLACE FUNCTION accumulate_equiv_student_point () RETURNS TRIGGER AS
--   $block1$
--     BEGIN
--       SELECT * FROM 
--       CALL aggregate_student_point_with_quiz_attempt(NEW.exam_id);
--       RETURN NEW;
--     END;
--   $block1$ LANGUAGE PLPGSQL;


--   CREATE OR REPLACE PROCEDURE aggregate_student_point_with_quiz_attempt (exam_id UUID)
--   LANGUAGE PLPGSQL AS
--   $block2$
--   BEGIN
--     INSERT INTO assessments (assessment_id) VALUES (exam_id);
--   END;
--   $block2$;


  -- CREATE OR REPLACE FUNCTION insert_quiz_equiv_assessment () RETURNS TRIGGER AS
  -- $block3$
  --   BEGIN
  --     CALL insert_assessment_with_quiz_id(NEW.quiz_id);
  --     RETURN NEW;
  --   END;
  -- $block3$ LANGUAGE PLPGSQL;

  -- CREATE OR REPLACE PROCEDURE insert_assessment_with_quiz_id (quiz_id UUID)
  -- LANGUAGE PLPGSQL AS
  -- $block2$
  -- BEGIN
  --   INSERT INTO assessments (assessment_id) VALUES (quiz_id);
  -- END;
  -- $block2$;
  -- RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for "students.points" update.';

END
$block$ LANGUAGE PLPGSQL;