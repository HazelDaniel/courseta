DO
$block1$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION:  setting up the SET function request a new creator pass';

    CREATE OR REPLACE FUNCTION request_new_creator_pass(creator_id_ UUID) RETURNS TEXT AS
    $block$
    DECLARE
      new_creator_pass          TEXT;
    BEGIN
        new_creator_pass := gen_random_uuid()::TEXT;
        UPDATE courseta.creators SET creator_pass = new_creator_pass
        WHERE creators.creator_id = creator_id_;
        RETURN new_creator_pass;
    END;
    $block$ LANGUAGE PLPGSQL;

END;
$block1$ LANGUAGE PLPGSQL;
