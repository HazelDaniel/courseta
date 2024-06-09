DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_current_creator function ...';

  CREATE OR REPLACE FUNCTION get_current_creator (email_ TEXT) RETURNS
  TABLE (creator_id UUID, email VARCHAR, role USER_ROLE_TYPE, creator_pass TEXT) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT creators.creator_id, creators.email, creators.role, creators.creator_pass FROM creators
    WHERE creators.email = email_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_current_creator function.';
END
$block$ LANGUAGE PLPGSQL;