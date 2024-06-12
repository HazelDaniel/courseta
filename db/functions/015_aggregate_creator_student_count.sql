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
    RAISE NOTICE '[debug]: getting student counts for creator';

    SELECT INTO tot_student_count COUNT (*) FROM (
      SELECT DISTINCT ON (students__courses.student_id) COUNT(*)
      FROM courseta.students__courses
      JOIN courseta.courses USING (course_id)
      WHERE courses.creator_id = creator_id_
      GROUP BY students__courses.student_id
    ) AS RES;

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
		IF TG_OP = 'DELETE' THEN
			RETURN OLD;
		END IF;
    RETURN NEW;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update of the creator.student_count.';
END
$block$ LANGUAGE PLPGSQL;
