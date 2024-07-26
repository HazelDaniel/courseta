DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update of the creator.student_count.';

  CREATE OR REPLACE PROCEDURE p_01_update_student_equiv_creator_count
  (course_id_ BIGINT) LANGUAGE PLPGSQL AS
  $block2$
  DECLARE
    tot_student_count         INT;
    equiv_creator_id_        UUID;
  BEGIN
    SELECT INTO equiv_creator_id_ creator_id FROM courseta.courses
    WHERE course_id = course_id_;
    -- RAISE NOTICE '[debug]: updating the student count on creator';

    WITH distinct_enrollment_on_course AS (
      SELECT ROW_NUMBER() OVER (PARTITION BY students__courses.student_id), students__courses.student_id, students__courses.course_id FROM
      courseta.students__courses
      JOIN courseta.courses USING (course_id)
      WHERE courses.creator_id = equiv_creator_id_
    )
    SELECT INTO tot_student_count COUNT(*) FROM distinct_enrollment_on_course WHERE row_number = 1;

    UPDATE creators SET student_count = tot_student_count
		WHERE creators.creator_id = equiv_creator_id_;
  END;
  $block2$;

  CREATE OR REPLACE FUNCTION p_02_update_student_count_on_creator () RETURNS TRIGGER AS
  $block1$
  BEGIN

    CASE TG_OP
      WHEN 'INSERT' THEN
          CALL p_01_update_student_equiv_creator_count(NEW.course_id);
          RETURN NEW;
      WHEN 'DELETE' THEN
          CALL p_01_update_student_equiv_creator_count(OLD.course_id);
          RETURN OLD;
      ELSE
        -- RAISE EXCEPTION 'cannot perform any other operation other than insert and delete %', TG_OP;
        RETURN NEW;
      END CASE;

  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update of the creator.student_count.';
END
$block$ LANGUAGE PLPGSQL;
