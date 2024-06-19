DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up functions that update creator info.';

  RAISE NOTICE '<[SETUP]   (SET) FUNCTION: setting up the update_creator_pass function.';

  CREATE OR REPLACE FUNCTION update_creator_pass (
    creator_id_ UUID,
    old_pass TEXT,
    new_pass TEXT
  )
  RETURNS VOID AS
  $block1$
  BEGIN
    UPDATE courseta.creators
    SET creator_pass = new_pass
    WHERE creator_id = creator_id_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '<[SETUP]   (SET) FUNCTION: DONE setting up the update_creator_pass function.';

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up functions that update creator info.';

END;
$block$ LANGUAGE PLPGSQL;
