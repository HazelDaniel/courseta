DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update of the course.student_count.';

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for addition to the course.student_count.';

  CREATE OR REPLACE FUNCTION add_student_count_to_course () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CALL add_student_equiv_course_count(NEW.course_id);
  END;
  $block1$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE PROCEDURE add_student_equiv_course_count
  (course_id BIGINT) LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    UPDATE courses SET student_count = (student_count + 1)
    WHERE course_id = course_id;
  END;
  $block2$;

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for addition to the course.student_count.';


  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for removal from the course.student_count.';

  CREATE OR REPLACE FUNCTION remove_student_count_from_course () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CALL subtract_student_equiv_course_count(OLD.course_id);
  END;
  $block1$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE PROCEDURE subtract_student_equiv_course_count
  (course_id BIGINT) LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    UPDATE courses SET student_count = (student_count - 1)
    WHERE course_id = course_id;
  END;
  $block2$;

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for removal from the course.student_count.';

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update of the course.student_count.';
END
$block$ LANGUAGE PLPGSQL;