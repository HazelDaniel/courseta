DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update of the creator.course_review_count.';

  CREATE OR REPLACE FUNCTION update_course_review_count_on_creator () RETURNS TRIGGER AS
  $block1$
  BEGIN
    IF NEW.review_count <> OLD.review_count THEN
      CALL update_course_review_equiv_creator_count(NEW.creator_id);
    END IF;

		IF TG_OP = 'DELETE' THEN
			RETURN OLD;
		END IF;

    RETURN NEW;
  END;
  $block1$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE PROCEDURE update_course_review_equiv_creator_count
  (creator_id_ UUID) LANGUAGE PLPGSQL AS
  $block2$
  DECLARE
    tot_review_count         INT;
  BEGIN
    SELECT INTO tot_review_count review_count_ FROM(
    SELECT COALESCE(SUM(review_count), 0) review_count_
    FROM courseta.courses
    WHERE courses.creator_id = creator_id_
		GROUP BY creator_id) as RES;

    UPDATE courseta.creators
    SET course_review_count = tot_review_count
    WHERE creators.creator_id = creator_id_;
  END;
  $block2$;

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update of the creator.course_review_count.';
END
$block$ LANGUAGE PLPGSQL;
