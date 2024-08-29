DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_current_user function ...';

  CREATE OR REPLACE FUNCTION get_current_user (id UUID, role courseta.USER_ROLE_TYPE) RETURNS
  TABLE (avatar_meta JSONB) AS
  $block1$
  BEGIN
    CASE role
      WHEN 'creator' THEN
        RETURN QUERY SELECT creators.avatar_meta FROM courseta.creators
        WHERE creators.creator_id = id;
      ELSE
      RETURN QUERY SELECT students.avatar_meta FROM courseta.students
      WHERE students.student_id = id;
    END CASE;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_current_user function.';
END
$block$ LANGUAGE PLPGSQL;
