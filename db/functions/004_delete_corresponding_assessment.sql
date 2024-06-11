DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for assessment deletion.';
  CREATE OR REPLACE FUNCTION delete_exam_equiv_assessment () RETURNS TRIGGER AS
  $block1$
    BEGIN
      CALL delete_assessment_with_exam_id(OLD.exam_id);
      RETURN OLD;
    END;
  $block1$ LANGUAGE PLPGSQL;


  CREATE OR REPLACE PROCEDURE delete_assessment_with_exam_id (exam_id_ UUID)
  LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    DELETE FROM assessments WHERE assessments.assessment_id = exam_id_;
  END;
  $block2$;

  CREATE OR REPLACE FUNCTION delete_quiz_equiv_assessment () RETURNS TRIGGER AS
  $block3$
    BEGIN
      CALL delete_assessment_with_quiz_id(OLD.quiz_id);
      RETURN OLD;
    END;
  $block3$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE PROCEDURE delete_assessment_with_quiz_id (quiz_id_ UUID)
  LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    DELETE FROM assessments WHERE assessments.assessment_id = quiz_id_;
  END;
  $block2$;

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for assessment deletion.';
END
$block$ LANGUAGE PLPGSQL;
