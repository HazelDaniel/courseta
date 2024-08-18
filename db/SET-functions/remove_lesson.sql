DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up the remove_lesson function ...';

  CREATE OR REPLACE PROCEDURE remove_lesson (lesson_id_ BIGINT)
  LANGUAGE PLPGSQL AS
  $block1$
  BEGIN
    DELETE from courseta.lessons WHERE lessons.lesson_id = lesson_id_;
  END;
  $block1$;

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up the remove_lesson function.';
END
$block$ LANGUAGE PLPGSQL;
