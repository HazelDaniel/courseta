DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_lesson_contents function ...';

  CREATE OR REPLACE FUNCTION get_lesson_contents (lesson_id_ BIGINT) RETURNS
  TABLE (
    lesson_content_id BIGINT,
    title TEXT,
    href TEXT
  ) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT lesson_contents.lesson_content_id, lesson_contents.title, lesson_contents.href
    FROM courseta.lesson_contents
    WHERE lesson_contents.lesson_id = lesson_id_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_lesson_contents function.';
END
$block$ LANGUAGE PLPGSQL;
