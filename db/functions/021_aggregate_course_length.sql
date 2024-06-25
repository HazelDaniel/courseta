DO
$block$
BEGIN
  -- RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update of the course.course_length.';

  CREATE OR REPLACE PROCEDURE add_length_to_course (course_id_ BIGINT, length_ INT)
  LANGUAGE PLPGSQL AS
  $block1$
  BEGIN
    UPDATE courseta.courses
    SET course_length = course_length + length_
    WHERE course_id = course_id_;
  END;
  $block1$;

  CREATE OR REPLACE FUNCTION update_course_length () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CASE TG_OP
      WHEN 'UPDATE' THEN
        IF NEW.total_duration <> OLD.total_duration THEN
          CALL add_length_to_course(NEW.course_id, NEW.total_duration - OLD.total_duration);
        END IF;
        RETURN NEW;
      WHEN 'INSERT' THEN
        CALL add_length_to_course(NEW.course_id, NEW.total_duration);
        RETURN NEW;
      WHEN 'DELETE' THEN
        CALL add_length_to_course(OLD.course_id, 0 - OLD.total_duration);
        RETURN OLD;
    END CASE;
  END;
  $block1$ LANGUAGE PLPGSQL;

  -- RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update of the course.course_length.';
END
$block$ LANGUAGE PLPGSQL;

