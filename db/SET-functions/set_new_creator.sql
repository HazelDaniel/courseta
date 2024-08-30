DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up the set_new_creator function ...';

  CREATE OR REPLACE FUNCTION set_new_creator (
  -- +1 OVERLOADS
    email_ VARCHAR,
    first_name_ VARCHAR,
    last_name_ VARCHAR,
    password_ TEXT,
    salt_ TEXT,
    verification_id_ TEXT
  ) RETURNS UUID
  AS
  $block1$
  DECLARE
    result_id   UUID;
  BEGIN
    INSERT INTO creators (email, first_name, last_name, password, salt, created_at, verification_id)
    VALUES (email_, first_name_, last_name_, password_, salt_, CURRENT_TIMESTAMP, verification_id_)
    RETURNING creator_id INTO result_id;

    RETURN result_id;
  END;
  $block1$ LANGUAGE PLPGSQL;

  -- CREATE OR REPLACE FUNCTION set_new_creator (
  -- -- [OVERLOAD]: for testing
  --   email_ VARCHAR,
  --   first_name_ VARCHAR,
  --   last_name_ VARCHAR,
  --   password_ TEXT,
  --   creator_id_ UUID,
  --   salt_ TEXT
  -- ) RETURNS VOID
  -- AS
  -- $block1$
  -- BEGIN
  --   INSERT INTO creators (email, first_name, last_name, password, salt, created_at, creator_id)
  --   VALUES (email_, first_name_, last_name_, password_, salt_, CURRENT_TIMESTAMP, creator_id_);
  -- END;
  -- $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up the set_new_creator function.';
END;
$block$ LANGUAGE PLPGSQL;
