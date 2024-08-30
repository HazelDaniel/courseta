DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_verification_credentials function ...';

  CREATE OR REPLACE FUNCTION get_verification_credentials (user_id_ UUID)
  RETURNS TABLE (verification_id TEXT, creator_pass TEXT, email VARCHAR) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT students.verification_id, NULL creator_pass, students.email
    FROM courseta.students
    WHERE students.student_id = user_id_;

    IF NOT FOUND THEN
      RETURN QUERY SELECT creators.verification_id, creators.creator_pass, creators.email
      FROM courseta.creators
      WHERE creators.creator_id = user_id_;
    END IF;

  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_verification_credentials function ...';
END;
$block$ LANGUAGE PLPGSQL;
