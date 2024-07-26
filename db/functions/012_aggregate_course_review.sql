DO
$block$
BEGIN
  -- RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update of the course.[review_attribute].';

  CREATE OR REPLACE PROCEDURE p_01_update_average_rating_on_course (course_id_ BIGINT)
  LANGUAGE PLPGSQL AS
  $block1$
  DECLARE
    avg_rating            NUMERIC;
  BEGIN
    SELECT INTO avg_rating AVG(rating) FROM 
    courseta.reviews WHERE course_id = course_id_;

    UPDATE courseta.courses SET
    average_rating = COALESCE(avg_rating::NUMERIC(2, 1), 5.0)
    WHERE courses.course_id = course_id_;
  END;
  $block1$;

  -- RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for addition to the course.review_count.';

  CREATE OR REPLACE PROCEDURE p_01_add_review_equiv_course_count
  (course_id_ BIGINT) LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    UPDATE courseta.courses SET review_count = review_count + 1
    WHERE courses.course_id = course_id_;
  END;
  $block2$;

  -- RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for addition to the course.[review attribute].';

  -- RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for deduction from the course.[review attribute].';

  CREATE OR REPLACE PROCEDURE p_01_subtract_review_equiv_course_count
  (course_id_ BIGINT) LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    UPDATE courseta.courses SET review_count = review_count - 1
    WHERE courses.course_id = course_id_;
  END;
  $block2$;

  -- RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for deducation from the course.[review attribute].';

  CREATE OR REPLACE FUNCTION p_02_update_review_on_course () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CASE TG_OP
      WHEN 'UPDATE' THEN
          CALL p_01_update_average_rating_on_course(NEW.course_id);
          RETURN NEW;
      WHEN 'INSERT' THEN
        -- RAISE NOTICE '[debug]: adding review instead with %', NEW.rating;
        CALL p_01_update_average_rating_on_course(NEW.course_id);
        CALL p_01_add_review_equiv_course_count(NEW.course_id);
        RETURN NEW;
      WHEN 'DELETE' THEN
        CALL p_01_update_average_rating_on_course(OLD.course_id);
        CALL p_01_subtract_review_equiv_course_count(OLD.course_id);
        RETURN OLD;
    END CASE;
  END;
  $block1$ LANGUAGE PLPGSQL;

  -- RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update of the course.[review_attribute].';
END
$block$ LANGUAGE PLPGSQL;
