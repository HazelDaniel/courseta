DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for user insertion.';

  CREATE OR REPLACE PROCEDURE p_01_insert_user_with_student_id (student_id UUID)
  LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    INSERT INTO users (user_id) VALUES (student_id);
  END;
  $block2$;

  CREATE OR REPLACE PROCEDURE p_01_insert_user_with_creator_id (creator_id UUID, role_ courseta.USER_ROLE_TYPE)
  LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    INSERT INTO users (user_id, role) VALUES (creator_id, role_);
  END;
  $block2$;

  CREATE OR REPLACE FUNCTION p_02_insert_student_equiv_user () RETURNS TRIGGER AS
  $block1$
    BEGIN
      CALL p_01_insert_user_with_student_id(NEW.student_id);
      RETURN NEW;
    END;
  $block1$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE FUNCTION p_02_insert_creator_equiv_user () RETURNS TRIGGER AS
  $block3$
    BEGIN
      CALL p_01_insert_user_with_creator_id(NEW.creator_id, 'creator'::courseta.USER_ROLE_TYPE);
      RETURN NEW;
    END;
  $block3$ LANGUAGE PLPGSQL;
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for user insertion.';

END
$block$ LANGUAGE PLPGSQL;