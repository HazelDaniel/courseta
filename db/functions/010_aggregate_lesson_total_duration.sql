DO
$block$
BEGIN
  -- RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update of the lesson.total_duration.';

  CREATE OR REPLACE PROCEDURE update_lesson_content_lesson_dur_and_count
  (lesson_id_ BIGINT, duration INT, increment_by SMALLINT) LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    UPDATE lessons SET total_duration = (total_duration + duration),
    content_count = (content_count + increment_by)
		WHERE lessons.lesson_id = lesson_id_;
  END;
  $block2$;

  CREATE OR REPLACE FUNCTION update_lesson_duration_and_content_count () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CASE TG_OP
      WHEN 'UPDATE' THEN
        IF NEW.duration <> OLD.duration THEN
          CALL update_lesson_content_lesson_dur_and_count(NEW.lesson_id, NEW.duration - OLD.duration, 0::SMALLINT);
        END IF;
        RETURN NEW;
      WHEN 'INSERT' THEN
          CALL update_lesson_content_lesson_dur_and_count(NEW.lesson_id, NEW.duration, 1::SMALLINT);
        RETURN NEW;
      WHEN 'DELETE' THEN
        CALL update_lesson_content_lesson_dur_and_count(OLD.lesson_id, OLD.duration, -1::SMALLINT);
        RETURN OLD;
    END CASE;
  END;
  $block1$ LANGUAGE PLPGSQL;

  -- RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update of the lesson.total_duration.';
END
$block$ LANGUAGE PLPGSQL;
