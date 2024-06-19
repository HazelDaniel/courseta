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
    avatar_url TEXT
  ) RETURNS
  TABLE (creator_id UUID, email VARCHAR, creator_pass TEXT, avatar JSONB) AS
  $block1$
  BEGIN
    RETURN QUERY
    INSERT INTO creators (email, first_name, last_name, password, avatar, created_at)
    VALUES (email_, first_name_, last_name_, password_,
    ('{"url": "' || avatar_url || '", "created_at": "' ||  CURRENT_TIMESTAMP::TEXT || '", "updated_at" : "' || CURRENT_TIMESTAMP::TEXT || '"}')::JSONB,
    CURRENT_TIMESTAMP)
    RETURNING creators.creator_id, creators.email, creators.creator_pass, creators.avatar;
  END;
  $block1$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE FUNCTION set_new_creator (
  -- [OVERLOAD]: for testing
    email_ VARCHAR,
    first_name_ VARCHAR,
    last_name_ VARCHAR,
    password_ TEXT,
    avatar_url TEXT,
    creator_id_ UUID
  ) RETURNS
  TABLE (email VARCHAR, creator_pass TEXT, avatar JSONB) AS
  $block1$
  BEGIN
    RETURN QUERY 
    INSERT INTO creators (email, first_name, last_name, password, avatar, created_at, creator_id)
    VALUES (email_, first_name_, last_name_, password_,
    ('{"url": "' || avatar_url || '", "created_at": "' ||  CURRENT_TIMESTAMP::TEXT || '", "updated_at" : "' || CURRENT_TIMESTAMP::TEXT || '"}')::JSONB,
    CURRENT_TIMESTAMP, creator_id_)
    RETURNING creators.email, creators.creator_pass, creators.avatar;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up the set_new_creator function.';
END;
$block$ LANGUAGE PLPGSQL;