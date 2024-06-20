DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_current_admin function ...';

  CREATE OR REPLACE FUNCTION get_current_admin (email_ TEXT) RETURNS
  TABLE (admin_id UUID, email VARCHAR, password TEXT) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT admins.admin_id, admins.email, admins.password
    FROM admins
    WHERE admins.email = email_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_current_admin function.';
END
$block$ LANGUAGE PLPGSQL;
