DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up the validate_user function ...';

  CREATE OR REPLACE FUNCTION validate_user (
    user_id_ UUID
  ) RETURNS VOID
  AS
  $block1$
  BEGIN
    UPDATE courseta.creators
    SET validated = 'true'
    WHERE creators.creator_id = user_id_;
    IF NOT FOUND THEN
      UPDATE courseta.students
      SET validated = 'true'
      WHERE students.student_id = user_id_;
    END IF;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up the validate_user function.';
END;
$block$ LANGUAGE PLPGSQL;
