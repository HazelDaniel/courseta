DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION:  setting up the SET function to upsert an assessment with its questions and answers included';

  CREATE OR REPLACE FUNCTION upsert_assessment(p_parent_entity_id BIGINT, assessment_data JSONB,
  questions_data JSONB, answers_data JSONB, trash_question_ids BIGINT[], assessment_type_ courseta.ASSESSMENT_TYPE)
  RETURNS UUID
  AS
  $block1$
  DECLARE
    created_assessment_id                    UUID;
    created_question_id                    BIGINT;
    question_entry                          JSONB;
    question_id_entry                      BIGINT;
    answer_entry                            JSONB;
  BEGIN
    -- a parent_entity_id could either be a lesson id or a course id
    -- unit of work: assessment creation
    CASE assessment_type_
    WHEN 'quiz' THEN
      INSERT INTO quizzes (lesson_id, pass_score, description, quiz_title)
      VALUES (p_parent_entity_id, (assessment_data->>'passScore')::SMALLINT, assessment_data->>'description', assessment_data->>'quizTitle')
      ON CONFLICT DO NOTHING RETURNING quiz_id INTO created_assessment_id;
    ELSE
      INSERT INTO exams (course_id, pass_score, description, duration, start_date, end_date)
      VALUES (p_parent_entity_id, (assessment_data->>'passScore')::SMALLINT, assessment_data->>'description', (assessment_data->>'duration')::SMALLINT,
      (assessment_data->>'startDate')::TIMESTAMPTZ, (assessment_data->>'endDate')::TIMESTAMPTZ)
      ON CONFLICT DO NOTHING RETURNING exam_id INTO created_assessment_id;
    END CASE;

    -- process questions
    FOR question_entry IN SELECT * FROM jsonb_array_elements(questions_data) LOOP
      INSERT INTO courseta.questions (assessment_id, question_text, points, assessment_type)
      VALUES (created_assessment_id, question_entry->>'questionText', (question_entry->>'points')::SMALLINT, assessment_type_) RETURNING question_id INTO created_question_id;
      -- process answers for this question
      FOR answer_entry IN SELECT * FROM jsonb_array_elements(answers_data) LOOP
        IF answer_entry->>'questionPositionID' = question_entry->>'positionID' THEN
          INSERT INTO courseta.answers (answer_text, is_correct, question_id)
          VALUES (answer_entry->>'answerText', (answer_entry->>'isCorrect')::BOOLEAN, created_question_id);
        END IF;
      END LOOP;

    END LOOP;

    FOR question_id_entry IN ARRAY trash_question_ids LOOP
      DELETE FROM courseta.questions WHERE question_id = question_id_entry;
    END LOOP;


    RETURN created_assessment_id;
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

  RAISE NOTICE '[SETUP]   (SET) FUNCTION:  DONE setting up the SET function to upsert an assessment with its questions and answers included';
END;
$block$ LANGUAGE PLPGSQL;

