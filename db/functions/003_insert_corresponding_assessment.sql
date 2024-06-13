DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for assessment insertion.';
  CREATE OR REPLACE FUNCTION insert_exam_equiv_assessment () RETURNS TRIGGER AS
  $block1$
    BEGIN
      CALL insert_assessment_with_exam_id(NEW.exam_id, NEW.description, 'exam');
      RETURN NEW;
    END;
  $block1$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE PROCEDURE insert_assessment_with_exam_id (exam_id UUID, exam_description TEXT, assessment_type courseta.ASSESSMENT_TYPE)
  LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    INSERT INTO assessments (assessment_id, description, assessment_type) VALUES (exam_id, exam_description, assessment_type);
  END;
  $block2$;


  CREATE OR REPLACE FUNCTION insert_quiz_equiv_assessment () RETURNS TRIGGER AS
  $block3$
    BEGIN
      CALL insert_assessment_with_quiz_id(NEW.quiz_id, NEW.description);
      RETURN NEW;
    END;
  $block3$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE PROCEDURE insert_assessment_with_quiz_id (quiz_id UUID, quiz_description TEXT)
  LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    INSERT INTO assessments (assessment_id, description) VALUES (quiz_id, quiz_description);
  END;
  $block2$;
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for assessment insertion.';

END
$block$ LANGUAGE PLPGSQL;
