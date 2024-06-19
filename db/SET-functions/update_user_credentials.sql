DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up functions that update user info.';

  RAISE NOTICE '<[SETUP]   (SET) FUNCTION: setting up the update_user_names function ...';

  CREATE OR REPLACE FUNCTION update_user_names (
    user_id_ UUID,
    first_name_ VARCHAR,
    last_name_ VARCHAR,
    type_ courseta.USER_ROLE_TYPE
  )
  RETURNS TABLE (first_name VARCHAR, last_name VARCHAR) AS
  $block1$
  BEGIN
    CASE type_
    WHEN 'student' THEN
      RETURN QUERY 
      UPDATE courseta.students
      SET first_name = COALESCE(first_name_, students.first_name), last_name = COALESCE(last_name_, students.last_name)
      WHERE student_id = user_id_
      RETURNING students.first_name, students.last_name;
    WHEN 'creator' THEN
      RETURN QUERY 
      UPDATE courseta.creators
      SET first_name = COALESCE(first_name_, creators.first_name), last_name = COALESCE(last_name_, creators.last_name)
      WHERE creator_id = user_id_
      RETURNING creators.first_name, creators.last_name;
    END CASE;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '<[SETUP]   (SET) FUNCTION: DONE setting up the update_user_names function.';


  RAISE NOTICE '<[SETUP]   (SET) FUNCTION: setting up the update_user_password function.';

  CREATE OR REPLACE FUNCTION update_user_password (
    user_id_ UUID,
    old_password TEXT,
    new_password TEXT,
    type_ courseta.USER_ROLE_TYPE
  )
  RETURNS VOID AS
  $block1$
  BEGIN
    CASE type_
    WHEN 'student' THEN
      UPDATE courseta.students
      SET password = new_password
      WHERE student_id = user_id_;
    WHEN 'creator' THEN
      UPDATE courseta.creators
      SET password = new_password
      WHERE creator_id = user_id_;
    END CASE;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '<[SETUP]   (SET) FUNCTION: DONE setting up the update_user_password function.';


  RAISE NOTICE '<[SETUP]   (SET) FUNCTION: setting up the update_user_email function.';

  CREATE OR REPLACE FUNCTION update_user_email (
    user_id_ UUID,
    new_email VARCHAR,
    type_ courseta.USER_ROLE_TYPE
  )
  RETURNS VOID AS
  $block1$
  BEGIN
    CASE type_
    WHEN 'student' THEN
      UPDATE courseta.students
      SET email = new_email
      WHERE student_id = user_id_;
    WHEN 'creator' THEN
      UPDATE courseta.creators
      SET email = new_email
      WHERE creator_id = user_id_;
    END CASE;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '<[SETUP]   (SET) FUNCTION: DONE setting up the update_user_email function.';


  RAISE NOTICE '<[SETUP]   (SET) FUNCTION: setting up the update_user_avatar function.';

  CREATE OR REPLACE FUNCTION update_user_avatar (
    user_id_ UUID,
    new_avatar TEXT,
    type_ courseta.USER_ROLE_TYPE
  )
  RETURNS VOID AS
  $block1$
  BEGIN
    CASE type_
    WHEN 'student' THEN
      UPDATE courseta.students
      SET avatar = avatar || ('{"url": "' || new_avatar || '", "created_at": "' ||  students.created_at::TEXT || '", "updated_at": "' || CURRENT_TIMESTAMP::TEXT || '"}')::JSONB
      WHERE student_id = user_id_;
    WHEN 'creator' THEN
      UPDATE courseta.creators
      SET avatar = avatar || ('{"url": "' || new_avatar || '", "created_at": "' ||  creators.created_at::TEXT || '", "updated_at": "' || CURRENT_TIMESTAMP::TEXT || '"}')::JSONB
      WHERE creator_id = user_id_;
    END CASE;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '<[SETUP]   (SET) FUNCTION: DONE setting up the update_user_avatar function.';

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up functions that update user info.';

END;
$block$ LANGUAGE PLPGSQL;
