DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the did_student_enroll function ...';

  CREATE OR REPLACE FUNCTION did_student_enroll (student_id_ UUID, course_id_ BIGINT) RETURNS
  BOOLEAN
  AS
  $block1$
  DECLARE
  enroll_count      INT;
  BEGIN
    SELECT INTO enroll_count COUNT(*) FROM
    courseta.students__courses
    WHERE student_id = student_id_
    AND course_id = course_id_;

    RETURN enroll_count::BOOLEAN;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the did_student_enroll function.';
END
$block$ LANGUAGE PLPGSQL;