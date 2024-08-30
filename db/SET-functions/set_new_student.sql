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
    -- avatar_url TEXT,
		-- avatar_id UUID,
    -- mime_type TEXT,
    salt_ TEXT,
    verification_id_ TEXT
  )
  RETURNS UUID AS
  $block1$
  DECLARE
    result_id   UUID;
  BEGIN
    -- RETURN QUERY
    INSERT INTO students (email, first_name, last_name, password, salt, created_at, verification_id)
    VALUES (email_, first_name_, last_name_, password_, salt_,
    -- decode(avatar_url, 'base64'),
    -- ('{"created_at": "' ||  CURRENT_TIMESTAMP::TEXT || '", "updated_at" : "' || CURRENT_TIMESTAMP::TEXT || '", "id": "' || avatar_id ||  '", "mime_type": "' || mime_type::TEXT || '"}')::JSONB,
    CURRENT_TIMESTAMP, verification_id_) RETURNING students.student_id INTO result_id;
    -- RETURNING students.student_id, students.rank, students.points, students.email, translate(encode(students.avatar, 'base64'), E' \t\n\r', ''), students.avatar_meta;
    RETURN result_id;
  END;
  $block1$ LANGUAGE PLPGSQL;


  -- CREATE OR REPLACE FUNCTION set_new_student (
  -- -- [OVERLOAD]: for testing
  --   email_ VARCHAR,
  --   first_name_ VARCHAR,
  --   last_name_ VARCHAR,
  --   password_ TEXT,
  --   -- avatar_url TEXT,
		-- -- avatar_id UUID,
  --   -- mime_type TEXT,
  --   student_id_ UUID,
  --   salt_ TEXT
  -- )
  -- -- RETURNS TABLE (student_id UUID, rank courseta.RANK_TYPE, points INT, email VARCHAR, avatar TEXT, avatar_meta JSONB) AS
  -- RETURNS VOID AS
  -- $block1$
  -- BEGIN
  --   -- RETURN QUERY
  --   INSERT INTO students (email, first_name, last_name, password, salt, created_at, student_id)
  --   VALUES (email_, first_name_, last_name_, password_, salt_,
  --   CURRENT_TIMESTAMP, student_id_);
  --   -- RETURNING students.student_id, students.rank, students.points, students.email, translate(encode(students.avatar, 'base64'), E' \t\n\r', ''), students.avatar_meta;
  -- END;
  -- $block1$ LANGUAGE PLPGSQL;


  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up the set_new_student function.';
END;
$block$ LANGUAGE PLPGSQL;
