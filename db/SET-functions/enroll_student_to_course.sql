DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up the enroll_student_to_course function ...';

  CREATE OR REPLACE FUNCTION enroll_student_to_course (student_id_ UUID, course_id_ BIGINT) RETURNS
  VOID AS
  $block1$
  BEGIN
    INSERT INTO courseta.students__courses(student_id, course_id)
    VALUES (student_id_, course_id_);
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up the enroll_student_to_course function.';
END;
$block$ LANGUAGE PLPGSQL;