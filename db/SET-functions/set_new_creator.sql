DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up the set_new_creator function ...';

  CREATE OR REPLACE FUNCTION set_new_creator (
    email_ VARCHAR,
    first_name_ VARCHAR,
    last_name_ VARCHAR,
    password_ TEXT
  ) RETURNS
  TABLE (creator_id UUID, email VARCHAR, creator_pass TEXT) AS
  $block1$
  BEGIN
    RETURN QUERY 
    INSERT INTO creators (email, first_name, last_name, password)
    VALUES (email_, first_name_, last_name_, password_)
    RETURNING creators.creator_id, creators.email, creators.creator_pass;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up the set_new_creator function.';
END;
$block$ LANGUAGE PLPGSQL;