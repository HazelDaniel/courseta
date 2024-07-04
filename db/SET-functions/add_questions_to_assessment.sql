DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION:  setting up the SET function to add questions to an exam or quiz';

  CREATE OR REPLACE FUNCTION add_questions_to_assessment(assessment_id_ UUID, questions_data JSONB, answers_data JSONB, assessment_type_ courseta.ASSESSMENT_TYPE)
  RETURNS VOID
  AS
  $block1$
  DECLARE
    created_question_id                    BIGINT;
    question_entry                          JSONB;
    answer_entry                            JSONB;
  BEGIN
    FOR question_entry IN SELECT * FROM jsonb_array_elements(questions_data) LOOP
      INSERT INTO courseta.questions (assessment_id, question_text, points, assessment_type)
      VALUES (assessment_id_, question_entry->>'questionText', (question_entry->>'points')::SMALLINT, assessment_type_) RETURNING question_id INTO created_question_id;
      -- process answers for this question

      FOR answer_entry IN SELECT * FROM jsonb_array_elements(answers_data) LOOP
        IF answer_entry->>'questionPositionID' = question_entry->>'positionID' THEN
          INSERT INTO courseta.answers (answer_text, is_correct, question_id)
          VALUES (answer_entry->>'answerText', (answer_entry->>'isCorrect')::BOOLEAN, created_question_id);
        END IF;
      END LOOP;
    END LOOP;

  EXCEPTION
    WHEN unique_violation THEN
      RAISE EXCEPTION 'Duplicate values provided that should be unique: %', SQLERRM;
    WHEN foreign_key_violation THEN
      RAISE EXCEPTION 'Some inputs are referencing non-existent columns: %', SQLERRM;
    WHEN others THEN
      RAISE EXCEPTION 'question addition failed. Check your inputs and try again: %', SQLERRM;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (SET) FUNCTION:  DONE setting up the SET function to add questions to an exam or quiz';
END;
$block$ LANGUAGE PLPGSQL;
