DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update of the creator.student_count.';

  CREATE OR REPLACE FUNCTION update_student_count_on_creator () RETURNS TRIGGER AS
  $block1$
  BEGIN
    IF NEW.student_count <> OLD.student_count THEN
      CALL update_student_equiv_creator_count(NEW.creator_id);
    END IF;
  END;
  $block1$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE PROCEDURE update_student_equiv_creator_count
  (creator_id BIGINT) LANGUAGE PLPGSQL AS
  $block2$
  DECLARE
    tot_student_count         INT;
  BEGIN
    SELECT INTO tot_student_count COALESCE(SUM(student_count), 0) FROM courses WHERE creator_id = creator_id;
    UPDATE creators SET student_count = tot_student_count WHERE creator_id = creator_id;
  END;
  $block2$;

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update of the creator.student_count.';
END
$block$ LANGUAGE PLPGSQL;