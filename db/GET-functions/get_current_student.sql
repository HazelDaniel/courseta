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
   avatar_url TEXT
  )
  AS
  $block1$
  BEGIN
    RETURN QUERY SELECT students.student_id, students.rank, students.points, students.email, students.role, students.avatar_url
    FROM courseta.students
    WHERE students.email = email_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_current_student function.';
END
$block$ LANGUAGE PLPGSQL;