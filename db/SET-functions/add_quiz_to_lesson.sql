DO
$block$
BEGIN
CREATE OR REPLACE FUNCTION add_quiz_to_lesson (p_lesson_id BIGINT, p_title TEXT, p_description TEXT, p_pass_score SMALLINT) RETURNS UUID
AS
$block1$
  DECLARE
    created_quiz_id           UUID;
  BEGIN
    created_quiz_id := gen_random_uuid();
    INSERT INTO courseta.quizzes(lesson_id, quiz_title, description, pass_score, quiz_id)
    VALUES (
      p_lesson_id,
      p_title,
      p_description,
      p_pass_score,
      created_quiz_id
    );

    RETURN created_quiz_id;

  EXCEPTION
    WHEN others THEN
      RAISE EXCEPTION 'quiz addition failed. Check your inputs and try again: %', SQLERRM;
  END;
$block1$ LANGUAGE PLPGSQL;
END;
$block$ LANGUAGE PLPGSQL;