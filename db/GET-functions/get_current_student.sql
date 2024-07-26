DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_current_student function ...';

  CREATE OR REPLACE FUNCTION get_current_student (email_ TEXT) RETURNS
  TABLE
  (
   student_id UUID,
   rank courseta.RANK_TYPE,
   points INT,
   email VARCHAR,
   role courseta.USER_ROLE_TYPE,
   avatar_url TEXT,
   first_name VARCHAR,
   last_name VARCHAR,
   created_at TIMESTAMPTZ
  )
  AS
  $block1$
  BEGIN
    RETURN QUERY SELECT students.student_id, students.rank, students.points, students.email, students.role, students.avatar->>'url' avatar_url,
    students.first_name, students.last_name, students.created_at
    FROM courseta.students
    WHERE students.email = email_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE FUNCTION get_current_student_validate (email_ TEXT) RETURNS
  TABLE
  (
   student_id UUID,
   password TEXT
  )
  AS
  $block1$
  BEGIN
    RETURN QUERY SELECT students.student_id, students.password
    FROM courseta.students
    WHERE students.email = email_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_current_student function.';
END
$block$ LANGUAGE PLPGSQL;