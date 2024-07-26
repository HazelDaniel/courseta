DO
$block$
BEGIN
  -- RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update of the creator.course_review_count.';

  CREATE OR REPLACE PROCEDURE p_01_update_course_review_equiv_creator_count
  (creator_id_ UUID) LANGUAGE PLPGSQL AS
  $block2$
  DECLARE
    tot_review         RECORD;
  BEGIN
    SELECT INTO tot_review review_count_, avg_rating FROM(
    SELECT COALESCE(SUM(review_count), 0) review_count_, AVG(average_rating) avg_rating
    FROM courseta.courses
    WHERE courses.creator_id = creator_id_
		GROUP BY creator_id) as RES;

    UPDATE courseta.creators
    SET course_review_count = COALESCE(tot_review.review_count_, 0),
    average_course_rating = COALESCE(tot_review.avg_rating::NUMERIC(2, 1), 5.0)
    WHERE creators.creator_id = creator_id_;
  END;
  $block2$;

  CREATE OR REPLACE FUNCTION p_02_update_course_review_count_on_creator () RETURNS TRIGGER AS
  $block1$
  BEGIN
    IF NEW.review_count <> OLD.review_count
    OR NEW.student_count <> OLD.student_count
    OR NEW.average_rating <> OLD.average_rating THEN
      CALL p_01_update_course_review_equiv_creator_count(NEW.creator_id);
    END IF;

		IF TG_OP = 'DELETE' THEN
      CALL p_01_update_course_review_equiv_creator_count(OLD.creator_id);
			RETURN OLD;
		END IF;

    RETURN NEW;
  END;
  $block1$ LANGUAGE PLPGSQL;

  -- RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update of the creator.course_review_count.';
END
$block$ LANGUAGE PLPGSQL;
