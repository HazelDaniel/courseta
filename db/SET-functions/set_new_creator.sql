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
    -- avatar_url TEXT,
		-- avatar_id UUID,
    -- mime_type TEXT,
    salt_ TEXT
  ) RETURNS VOID
  AS
  $block1$
  BEGIN
    -- RETURN QUERY
    -- INSERT INTO creators (email, first_name, last_name, password, salt, avatar, avatar_meta, created_at)
    -- VALUES (email_, first_name_, last_name_, password_, salt_,
    -- decode(avatar_url, 'base64'),
    -- ('{"created_at": "' ||  CURRENT_TIMESTAMP::TEXT || '", "updated_at" : "' || CURRENT_TIMESTAMP::TEXT || '", "id": "' || avatar_id ||  '", "mime_type": "' || mime_type::TEXT || '"}')::JSONB,
    -- CURRENT_TIMESTAMP)
    INSERT INTO creators (email, first_name, last_name, password, salt, created_at)
    VALUES (email_, first_name_, last_name_, password_, salt_, CURRENT_TIMESTAMP);
  END;
  $block1$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE FUNCTION set_new_creator (
  -- [OVERLOAD]: for testing
    email_ VARCHAR,
    first_name_ VARCHAR,
    last_name_ VARCHAR,
    password_ TEXT,
    -- avatar_url TEXT,
		-- avatar_id UUID,
    -- mime_type TEXT,
    creator_id_ UUID,
    salt_ TEXT
  ) RETURNS VOID
  AS
  $block1$
  BEGIN
    -- RETURN QUERY 
    -- INSERT INTO creators (email, first_name, last_name, password, salt, avatar, avatar_meta, created_at, creator_id)
    -- VALUES (email_, first_name_, last_name_, password_, salt_,
    -- decode(avatar_url, 'base64'),
    -- ('{"created_at": "' ||  CURRENT_TIMESTAMP::TEXT || '", "updated_at" : "' || CURRENT_TIMESTAMP::TEXT || '", "id": "' || avatar_id ||  '", "mime_type": "' || mime_type::TEXT || '"}')::JSONB,
    -- CURRENT_TIMESTAMP, creator_id_)
    INSERT INTO creators (email, first_name, last_name, password, salt, created_at, creator_id)
    VALUES (email_, first_name_, last_name_, password_, salt_, CURRENT_TIMESTAMP, creator_id_);
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up the set_new_creator function.';
END;
$block$ LANGUAGE PLPGSQL;
