DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update of the creator.course_count.';

  CREATE OR REPLACE PROCEDURE p_01_add_course_equiv_creator_count
  (creator_id_ UUID) LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    UPDATE courseta.creators
    SET course_count = course_count + 1
    WHERE creators.creator_id = creator_id_;
  END;
  $block2$;

  CREATE OR REPLACE PROCEDURE p_01_subtract_course_equiv_creator_count
  (creator_id_ UUID) LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    UPDATE courseta.creators
    SET course_count = course_count - 1
    WHERE creators.creator_id = creator_id_;
  END;
  $block2$;

  CREATE OR REPLACE FUNCTION p_02_update_course_count_on_creator () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CASE TG_OP
      WHEN 'INSERT' THEN
        CALL p_01_add_course_equiv_creator_count(NEW.creator_id);
        RETURN NEW;
      WHEN 'DELETE' THEN
        CALL p_01_subtract_course_equiv_creator_count(OLD.creator_id);
        RETURN OLD;
    END CASE;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update of the creator.course_count.';
END
$block$ LANGUAGE PLPGSQL;

