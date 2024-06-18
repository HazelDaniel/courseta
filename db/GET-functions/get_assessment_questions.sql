DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_assessment_questions function ...';

  CREATE OR REPLACE FUNCTION get_assessment_questions (assessment_id_ UUID) RETURNS
  TABLE (
    question_id BIGINT,
    question_text TEXT,
    answer_id BIGINT,
    answer_text TEXT,
    is_correct BOOLEAN
  ) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT questions.question_id, questions.question_text,
    answers.answer_id, answers.answer_text, answers.is_correct
    FROM courseta.questions
    JOIN courseta.answers USING (question_id)
    WHERE questions.assessment_id = assessment_id_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_assessment_questions function.';
END
$block$ LANGUAGE PLPGSQL;
