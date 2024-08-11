DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up functions that retrieves user password.';

  CREATE OR REPLACE FUNCTION get_user_hash_and_salt (
    user_id_ UUID,
    type_ courseta.USER_ROLE_TYPE
  )
  RETURNS TABLE(hash TEXT, salt TEXT) AS
  $block1$
  DECLARE
  BEGIN
    CASE type_
    WHEN 'student' THEN
      RETURN QUERY SELECT password hash, students.salt FROM courseta.students WHERE student_id = user_id_;
    WHEN 'creator' THEN
      RETURN QUERY SELECT password hash, creators.salt FROM courseta.creators WHERE creator_id = user_id_;
    END CASE;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up functions that retrieves user password.';

END;
$block$ LANGUAGE PLPGSQL;
