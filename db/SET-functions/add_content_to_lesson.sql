DO
$block$
BEGIN
CREATE OR REPLACE FUNCTION add_content_to_lesson (p_lesson_id, p_title, p_href, p_content_type, p_duration) RETURNS VOID
AS
$block1$
  BEGIN
    INSERT INTO courseta.lesson_contents(lesson_id, title, href, content_type, duration)
    VALUES (
      p_lesson_id,
      p_title,
      p_href,
      p_content_type::courseta.LESSON_CONTENT_TYPE,
      p_duration::INT
    );
  EXCEPTION
    WHEN others THEN
      RAISE EXCEPTION 'content addition failed. Check your inputs and try again: %', SQLERRM;
  END;
$block1$
END;
$block$ LANGUAGE PLPGSQL;