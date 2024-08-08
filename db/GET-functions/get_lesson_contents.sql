DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_lesson_contents function ...';

  CREATE OR REPLACE FUNCTION get_lesson_contents (lesson_id_ BIGINT) RETURNS
  TABLE (
    id BIGINT,
    title TEXT,
    href TEXT,
    content_type courseta.LESSON_CONTENT_TYPE,
    duration INT
  ) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT lc.lesson_content_id id, lc.title, lc.href, lc.content_type, lc.duration
    FROM courseta.lesson_contents lc WHERE lc.lesson_id = lesson_id_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_lesson_contents function.';
END
$block$ LANGUAGE PLPGSQL;
