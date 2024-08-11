DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up the set_new_admin function ...';

  CREATE OR REPLACE FUNCTION set_new_admin (
    email_ VARCHAR,
    password_ TEXT,
    salt_ TEXT
  ) RETURNS TABLE (admin_id UUID)
  AS
  $block1$
  BEGIN
    RETURN QUERY INSERT INTO courseta.admins (email, password, salt)
    VALUES (email_, password_, salt_)
    RETURNING admins.admin_id;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up the set_new_admin function.';
END;
$block$ LANGUAGE PLPGSQL;
