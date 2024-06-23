DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up the unenroll_student_from_course function ...';

  CREATE OR REPLACE FUNCTION unenroll_student_from_course (student_id_ UUID, course_id_ BIGINT) RETURNS
  VOID AS
  $block1$
  BEGIN
    DELETE FROM courseta.students__courses
    WHERE students__courses.student_id = student_id_
    AND students__courses.course_id = course_id_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up the unenroll_student_from_course function.';
END;
$block$ LANGUAGE PLPGSQL;
