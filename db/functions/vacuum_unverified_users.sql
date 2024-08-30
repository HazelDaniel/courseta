DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up the vacuum_unverified_users function ...';

  CREATE OR REPLACE FUNCTION vacuum_unverified_users () RETURNS VOID
  AS
  $block1$
  BEGIN
    DELETE FROM courseta.students
    WHERE students.validated = 'false'
    AND students.created_at <= NOW() - INTERVAL '1 day';

    DELETE FROM courseta.creators
    WHERE creators.validated = 'false'
    AND creators.created_at <= NOW() - INTERVAL '1 day';
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up the vacuum_unverified_users function.';
END;
$block$ LANGUAGE PLPGSQL;
