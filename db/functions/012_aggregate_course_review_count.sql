DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update of the course.review_count.';

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for addition to the course.review_count.';

  CREATE OR REPLACE FUNCTION add_review_count_to_course () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CALL add_review_equiv_course_count(NEW.course_id);
		RETURN NEW;
  END;
  $block1$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE PROCEDURE add_review_equiv_course_count
  (course_id_ BIGINT) LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    UPDATE courseta.courses SET review_count = review_count + 1
    WHERE courses.course_id = course_id_;
  END;
  $block2$;

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for addition to the course.review_count.';


  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for deduction from the course.review_count.';

  CREATE OR REPLACE FUNCTION remove_review_count_from_course () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CALL subtract_review_equiv_course_count(OLD.course_id);
		RETURN OLD;
  END;
  $block1$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE PROCEDURE subtract_review_equiv_course_count
  (course_id_ BIGINT) LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    UPDATE courseta.courses SET review_count = review_count - 1
    WHERE courses.course_id = course_id_;
  END;
  $block2$;

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for deducation from the course.review_count.';

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update of the course.review_count.';
END
$block$ LANGUAGE PLPGSQL;
