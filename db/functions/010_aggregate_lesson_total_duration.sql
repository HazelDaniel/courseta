DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update of the lesson.total_duration.';

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for addition to the lesson.total_duration.';

  CREATE OR REPLACE FUNCTION add_total_duration_and_content_count_to_lesson () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CALL add_lesson_content_equiv_lesson_dur_and_count(NEW.lesson_id, NEW.duration);
		RETURN NEW;
  END;
  $block1$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE PROCEDURE add_lesson_content_equiv_lesson_dur_and_count
  (lesson_id_ UUID, duration INT) LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    UPDATE lessons SET total_duration = (total_duration + duration),
    content_count = (content_count + 1)
		WHERE lessons.lesson_id = lesson_id_;
  END;
  $block2$;

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for addition to the lesson.total_duration.';


  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for subtraction from the lesson.total_duration.';

  CREATE OR REPLACE FUNCTION remove_total_duration_and_content_count_from_lesson () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CALL subtract_lesson_content_equiv_lesson_dur_and_count(OLD.lesson_id, OLD.duration);
		RETURN OLD;
  END;
  $block1$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE PROCEDURE subtract_lesson_content_equiv_lesson_dur_and_count
  (lesson_id_ UUID, duration INT) LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    UPDATE lessons SET total_duration = (total_duration - duration),
    content_count = (content_count - 1)
		WHERE lessons.lesson_id = lesson_id_;
  END;
  $block2$;

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for subtraction from the lesson.total_duration.';

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update of the lesson.total_duration.';
END
$block$ LANGUAGE PLPGSQL;
