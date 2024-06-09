DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up the set_new_student function ...';

  CREATE OR REPLACE FUNCTION set_new_student (
    email_ VARCHAR,
    first_name_ VARCHAR,
    last_name_ VARCHAR,
    password_ TEXT
  )
  RETURNS TABLE (student_id UUID, rank courseta.RANK_TYPE, points INT, email VARCHAR) AS
  $block1$
  BEGIN
    RETURN QUERY 
    INSERT INTO students (email, first_name, last_name, password)
    VALUES (email_, first_name_, last_name_, password_)
    RETURNING students.student_id, students.rank, students.points, students.email;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up the set_new_student function.';
END;
$block$ LANGUAGE PLPGSQL;