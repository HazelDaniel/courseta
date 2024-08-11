DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION:  setting up the SET function to update an assessment with its questions and answers included';

  CREATE OR REPLACE FUNCTION update_assessment(p_parent_entity_id BIGINT, assessment_id_ UUID,
  questions_data JSONB, answers_data JSONB, trash_question_ids BIGINT[])
  RETURNS UUID
  AS
  $block1$
  DECLARE
    created_question_id                          BIGINT;
    question_entry                                JSONB;
    question_id_entry                            BIGINT;
    answer_entry                                  JSONB;
	corresponding_type         courseta.ASSESSMENT_TYPE;
  BEGIN
    -- a parent_entity_id could either be a lesson id or a course id
    -- unit of work: assessment creation
    SELECT INTO corresponding_type assessment_type FROM courseta.quizzes
    WHERE quiz_id = assessment_id_;

    IF corresponding_type IS NULL THEN
        SELECT INTO corresponding_type assessment_type FROM courseta.exams
        WHERE exam_id = assessment_id_;
    END IF;


    -- process questions
    FOR question_entry IN SELECT * FROM jsonb_array_elements(questions_data) LOOP
      INSERT INTO courseta.questions (assessment_id, question_text, points, assessment_type)
      VALUES (assessment_id_, question_entry->>'questionText', (question_entry->>'points')::SMALLINT, corresponding_type) RETURNING question_id INTO created_question_id;
      -- process answers for this question
      FOR answer_entry IN SELECT * FROM jsonb_array_elements(answers_data) LOOP
        IF answer_entry->>'questionPositionID' = question_entry->>'positionID' THEN
          INSERT INTO courseta.answers (answer_text, is_correct, question_id)
          VALUES (answer_entry->>'answerText', (answer_entry->>'isCorrect')::BOOLEAN, created_question_id);
        END IF;
      END LOOP;

    END LOOP;

    FOREACH question_id_entry IN ARRAY trash_question_ids LOOP
      DELETE FROM courseta.questions WHERE question_id = question_id_entry;
    END LOOP;

    RETURN assessment_id_;
    -- save unit of work

  EXCEPTION
    WHEN unique_violation THEN
      RAISE EXCEPTION 'Duplicate values provided that should be unique: %', SQLERRM;
    WHEN foreign_key_violation THEN
      RAISE EXCEPTION 'Some inputs are referencing non-existent columns: %', SQLERRM;
    WHEN others THEN
      RAISE EXCEPTION 'lesson creation failed. Check your inputs and try again: %', SQLERRM;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (SET) FUNCTION:  DONE setting up the SET function to update an assessment with its questions and answers included';
END;
$block$ LANGUAGE PLPGSQL;
