DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up the set_new_student function ...';

  CREATE OR REPLACE FUNCTION set_new_student (
  -- +1 OVERLOADS
    email_ VARCHAR,
    first_name_ VARCHAR,
    last_name_ VARCHAR,
    password_ TEXT,
    avatar_url TEXT
  )
  RETURNS TABLE (student_id UUID, rank courseta.RANK_TYPE, points INT, email VARCHAR, avatar JSONB) AS
  $block1$
  BEGIN
    RETURN QUERY 
    INSERT INTO students (email, first_name, last_name, password, avatar, created_at)
    VALUES (email_, first_name_, last_name_, password_,
    ('{"url": "' || avatar_url || '", "created_at": "' ||  CURRENT_TIMESTAMP::TEXT || '", "updated_at" : "' || CURRENT_TIMESTAMP::TEXT || '"}')::JSONB,
    CURRENT_TIMESTAMP)
    RETURNING students.student_id, students.rank, students.points, students.email, students.avatar;
  END;
  $block1$ LANGUAGE PLPGSQL;


  CREATE OR REPLACE FUNCTION set_new_student (
  -- [OVERLOAD]: for testing
    email_ VARCHAR,
    first_name_ VARCHAR,
    last_name_ VARCHAR,
    password_ TEXT,
    avatar_url TEXT,
    student_id_ UUID
  )
  RETURNS TABLE (student_id UUID, rank courseta.RANK_TYPE, points INT, email VARCHAR, avatar JSONB) AS
  $block1$
  BEGIN
    RETURN QUERY
    INSERT INTO students (email, first_name, last_name, password, avatar, created_at, student_id)
    VALUES (email_, first_name_, last_name_, password_,
    ('{"url": "' || avatar_url || '", "created_at": "' ||  CURRENT_TIMESTAMP::TEXT || '", "updated_at" : "' || CURRENT_TIMESTAMP::TEXT || '"}')::JSONB,
    CURRENT_TIMESTAMP, student_id_)
    RETURNING students.student_id, students.rank, students.points, students.email, students.avatar;
  END;
  $block1$ LANGUAGE PLPGSQL;


  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up the set_new_student function.';
END;
$block$ LANGUAGE PLPGSQL;