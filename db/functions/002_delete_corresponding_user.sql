DO
$block$
BEGIN
  -- RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for user deletion.';

  CREATE OR REPLACE PROCEDURE delete_user_with_student_id (student_id UUID)
  LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    DELETE FROM users WHERE users.user_id = student_id;
  END;
  $block2$;

  CREATE OR REPLACE FUNCTION delete_student_equiv_user () RETURNS TRIGGER AS
  $block1$
    BEGIN
      CALL delete_user_with_student_id(OLD.student_id);
      RETURN OLD;
    END;
  $block1$ LANGUAGE PLPGSQL;


  CREATE OR REPLACE PROCEDURE delete_user_with_creator_id (creator_id UUID)
  LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    DELETE FROM users WHERE users.user_id = creator_id;
  END;
  $block2$;

  CREATE OR REPLACE FUNCTION delete_creator_equiv_user () RETURNS TRIGGER AS
  $block3$
    BEGIN
      CALL delete_user_with_creator_id(OLD.creator_id);
      RETURN OLD;
    END;
  $block3$ LANGUAGE PLPGSQL;

  -- RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for user deletion.';
END
$block$ LANGUAGE PLPGSQL;
