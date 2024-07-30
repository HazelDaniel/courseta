DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_assessment_questions_tree_for_creator_edit function ...';

  CREATE OR REPLACE FUNCTION get_assessment_questions_tree_for_creator_edit (assessment_id_ UUID) RETURNS
  TABLE (
    question_text TEXT,
    points SMALLINT,
    answer_text TEXT,
    is_correct BOOLEAN
  ) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT questions.question_text, questions.points, answers.answer_text, answers.is_correct
    FROM courseta.questions
    LEFT JOIN courseta.answers USING (question_id)
    WHERE questions.assessment_id = assessment_id_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_assessment_questions_tree_for_creator_edit function.';
END
$block$ LANGUAGE PLPGSQL;
