DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the is_student_enrolled function ...';

  CREATE OR REPLACE FUNCTION is_student_enrolled (student_id_ UUID, course_id_ BIGINT) RETURNS
  TABLE (is_enrolled BIGINT) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT COUNT(*) is_enrolled FROM courseta.students__courses
    WHERE student_id = student_id_ AND course_id = course_id_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the is_student_enrolled function.';
END;
$block$ LANGUAGE PLPGSQL;

