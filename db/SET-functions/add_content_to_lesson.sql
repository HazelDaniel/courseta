DO
$block$
BEGIN
CREATE OR REPLACE FUNCTION add_content_to_lesson (p_lesson_id BIGINT, p_title TEXT, p_href TEXT, p_content_type courseta.LESSON_CONTENT_TYPE, p_duration INT) RETURNS BIGINT
AS
$block1$
  DECLARE
    result_content_id        BIGINT;
  BEGIN
    INSERT INTO courseta.lesson_contents(lesson_id, title, href, content_type, duration)
    VALUES (
      p_lesson_id,
      p_title,
      p_href,
      p_content_type::courseta.LESSON_CONTENT_TYPE,
      p_duration::INT
    ) RETURNING lesson_content_id INTO result_content_id;

    RETURN result_content_id;

  EXCEPTION
    WHEN others THEN
      RAISE EXCEPTION 'content addition failed. Check your inputs and try again: %', SQLERRM;
  END;
$block1$ LANGUAGE PLPGSQL;
END;
$block$ LANGUAGE PLPGSQL;