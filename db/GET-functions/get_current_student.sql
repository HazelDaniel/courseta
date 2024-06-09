DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   QUERY FUNCTION: setting up the get_current_student function ...';

  CREATE OR REPLACE FUNCTION get_current_student (email TEXT) RETURNS RECORD AS
  $block1$
  DECLARE
    student_field RECORD;
  BEGIN
    SELECT INTO student_field uuid id, rank, points, email, role FROM students
    WHERE email = email;

    RETURN student_field;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   QUERY FUNCTION: DONE setting up the get_current_student function.';
END
$block$ LANGUAGE PLPGSQL;