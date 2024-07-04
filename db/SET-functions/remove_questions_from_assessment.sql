DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION:  setting up the SET function to remove questions from an exam or quiz';

  CREATE OR REPLACE FUNCTION remove_questions_from_assessment(assessment_id_ UUID, question_ids BIGINT[], assessment_type_ courseta.ASSESSMENT_TYPE)
  RETURNS VOID
  AS
  $block1$
  BEGIN
    DELETE FROM courseta.questions WHERE question_id = ANY(question_ids);
  EXCEPTION
    WHEN unique_violation THEN
      RAISE EXCEPTION 'Duplicate values provided that should be unique: %', SQLERRM;
    WHEN foreign_key_violation THEN
      RAISE EXCEPTION 'Some inputs are referencing non-existent columns: %', SQLERRM;
    WHEN others THEN
      RAISE EXCEPTION 'question deletion failed. Check your inputs and try again: %', SQLERRM;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (SET) FUNCTION:  DONE setting up the SET function to remove questions from an exam or quiz';
END;
$block$ LANGUAGE PLPGSQL;

