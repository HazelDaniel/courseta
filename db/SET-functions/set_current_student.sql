DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   QUERY FUNCTION: setting up the set_current_student function ...';

  CREATE OR REPLACE FUNCTION set_current_student (email TEXT, first_name VARCHAR, last_name VARCHAR, password VARCHAR)
  RETURNS RECORD AS
  $block1$
  DECLARE
    student_details RECORD;
  BEGIN
    INSERT INTO students (email, first_name, last_name, password)
    VALUES (email, first_name, last_name, password)
    RETURNING (student_id, rank, points, email) INTO student_details;

    RETURN student_details;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   QUERY FUNCTION: DONE setting up the set_current_student function.';
END;
$block$ LANGUAGE PLPGSQL;