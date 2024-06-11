DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update of the course.lesson_count.';

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for addition to the course.lesson_count.';

  CREATE OR REPLACE FUNCTION add_lesson_count_to_course () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CALL add_lesson_equiv_course_count(NEW.course_id);
		RETURN NEW;
  END;
  $block1$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE PROCEDURE add_lesson_equiv_course_count
  (course_id_ BIGINT) LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    UPDATE courses SET lesson_count = (lesson_count + 1)
    WHERE courses.course_id = course_id_;
  END;
  $block2$;

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for addition to the course.review_count.';


  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for deduction from the course.lesson_count.';

  CREATE OR REPLACE FUNCTION remove_lesson_count_from_course () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CALL subtract_lesson_equiv_course_count(OLD.course_id);
		RETURN OLD;
  END;
  $block1$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE PROCEDURE subtract_lesson_equiv_course_count
  (course_id_ BIGINT) LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    UPDATE courses SET lesson_count = (lesson_count - 1)
    WHERE courses.course_id = course_id_;
  END;
  $block2$;

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for deduction from the course.lesson_count.';

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update of the course.lesson_count.';
END
$block$ LANGUAGE PLPGSQL;
