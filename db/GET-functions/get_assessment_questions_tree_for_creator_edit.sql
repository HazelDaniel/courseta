DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_assessment_questions_tree_for_creator_edit function ...';

  CREATE OR REPLACE FUNCTION get_assessment_questions_tree_for_creator_edit (assessment_id_ UUID) RETURNS
  TABLE (
    question_text TEXT,
    question_id BIGINT,
    points SMALLINT,
    answers JSONB
  ) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT questions.question_text, questions.question_id, questions.points,
    json_agg(json_build_object(
      'text', ans.answer_text,
      'correct', ans.is_correct,
      'id', ans.answer_id
    ))::JSONB answers
    FROM courseta.questions
    LEFT JOIN courseta.answers ans USING (question_id)
    WHERE questions.assessment_id = assessment_id_
    GROUP BY questions.question_id, questions.question_text, questions.points;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_assessment_questions_tree_for_creator_edit function.';
END
$block$ LANGUAGE PLPGSQL;
