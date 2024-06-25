DO
$block$
BEGIN
  -- RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update of the course.student_count.';

  -- RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for addition to the course.student_count.';

  CREATE OR REPLACE PROCEDURE add_student_equiv_course_count
  (course_id_ BIGINT) LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    UPDATE courses SET student_count = (student_count + 1)
    WHERE courses.course_id = course_id_;
  END;
  $block2$;

  CREATE OR REPLACE FUNCTION add_student_count_to_course () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CALL add_student_equiv_course_count(NEW.course_id);
    RETURN NEW;
  END;
  $block1$ LANGUAGE PLPGSQL;

  -- RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for addition to the course.student_count.';


  -- RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for removal from the course.student_count.';

  CREATE OR REPLACE PROCEDURE subtract_student_equiv_course_count
  (course_id_ BIGINT) LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    UPDATE courses SET student_count = (student_count - 1)
    WHERE courses.course_id = course_id_;
  END;
  $block2$;

  CREATE OR REPLACE FUNCTION remove_student_count_from_course () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CALL subtract_student_equiv_course_count(OLD.course_id);
		RETURN OLD;
  END;
  $block1$ LANGUAGE PLPGSQL;
  -- RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for removal from the course.student_count.';

  -- RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update of the course.student_count.';
END
$block$ LANGUAGE PLPGSQL;
