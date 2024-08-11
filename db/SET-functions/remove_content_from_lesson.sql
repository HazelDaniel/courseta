DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up the remove_content_from_lesson function ...';

  CREATE OR REPLACE PROCEDURE remove_content_from_lesson (lesson_id_ BIGINT, content_id_ BIGINT)
  LANGUAGE PLPGSQL AS
  $block1$
  BEGIN
    DELETE from courseta.lesson_contents
    WHERE lesson_contents.lesson_id = lesson_id_
    AND lesson_contents.lesson_content_id = content_id_;
  END;
  $block1$;

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up the remove_content_from_lesson function.';
END
$block$ LANGUAGE PLPGSQL;
