DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for user insertion.';
  CREATE OR REPLACE FUNCTION insert_student_equiv_user () RETURNS TRIGGER AS
  $block1$
    BEGIN
      CALL insert_user_with_student_id(NEW.student_id);
      RETURN NEW;
    END;
  $block1$ LANGUAGE PLPGSQL;


  CREATE OR REPLACE PROCEDURE insert_user_with_student_id (student_id UUID)
  LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    INSERT INTO users (user_id) VALUES (student_id);
  END;
  $block2$;

  CREATE OR REPLACE FUNCTION insert_creator_equiv_user () RETURNS TRIGGER AS
  $block3$
    BEGIN
      CALL insert_user_with_creator_id(NEW.creator_id);
      RETURN NEW;
    END;
  $block3$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE PROCEDURE insert_user_with_creator_id (creator_id UUID)
  LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    INSERT INTO users (user_id) VALUES (creator_id);
  END;
  $block2$;
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for user insertion.';

END
$block$ LANGUAGE PLPGSQL;