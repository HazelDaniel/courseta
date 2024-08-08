DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_quiz function ...';

  CREATE OR REPLACE FUNCTION get_quiz (quiz_id_ UUID) RETURNS
  TABLE (
    quiz_title TEXT,
    pass_score SMALLINT,
    description VARCHAR,
    question_count SMALLINT,
    total_points INT
  ) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT quizzes.quiz_title, quizzes.pass_score,
    quizzes.description, quizzes.question_count, quizzes.total_points
    FROM courseta.quizzes
    WHERE quizzes.quiz_id = quiz_id_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_quiz function.';
END
$block$ LANGUAGE PLPGSQL;
