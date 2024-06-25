DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update of the creator.student_count.';

  CREATE OR REPLACE PROCEDURE update_student_equiv_creator_count
  (creator_id_ UUID) LANGUAGE PLPGSQL AS
  $block2$
  DECLARE
    tot_student_count         INT;
  BEGIN

    RAISE NOTICE '[debug]: updating the student count on creator';

    SELECT INTO tot_student_count SUM (student_count) 
    FROM courseta.courses
    WHERE courses.creator_id = creator_id_;

    UPDATE creators SET student_count = tot_student_count
		WHERE creators.creator_id = creator_id_;
  END;
  $block2$;

  CREATE OR REPLACE FUNCTION update_student_count_on_creator () RETURNS TRIGGER AS
  $block1$
  BEGIN
    IF NEW.student_count <> OLD.student_count THEN
      CALL update_student_equiv_creator_count(NEW.creator_id);
    END IF;
    RETURN NEW;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update of the creator.student_count.';
END
$block$ LANGUAGE PLPGSQL;
