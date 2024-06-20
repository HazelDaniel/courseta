DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up functions that update admin info.';

  RAISE NOTICE '<[SETUP]   (SET) FUNCTION: setting up the update_admin_password function.';

  CREATE OR REPLACE FUNCTION update_admin_password (
    admin_id_ UUID,
    new_pass TEXT
  )
  RETURNS VOID AS
  $block1$
  BEGIN
    UPDATE courseta.admins
    SET password = new_pass
    WHERE admin_id = admin_id_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '<[SETUP]   (SET) FUNCTION: DONE setting up the update_admin_password function.';

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up functions that update admin info.';

END;
$block$ LANGUAGE PLPGSQL;

