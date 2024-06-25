DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up the delete_course_if_creator_is function ...';

  CREATE OR REPLACE FUNCTION delete_course_if_creator_is (course_id_ BIGINT, creator_id_ UUID) RETURNS
  VOID AS
  $block1$
  DECLARE
    equiv_creator_id_       UUID;
  BEGIN
    SELECT INTO equiv_creator_id_ creator_id FROM courseta.courses
    WHERE course_id = course_id_;

    IF equiv_creator_id_ <> creator_id_ THEN
      RAISE EXCEPTION 'you cannot delete a course you didn''t create!'
      RETURN;
    END IF;

    DELETE FROM courseta.courses
    WHERE courses.creator_id = creator_id_;

  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up the delete_course_if_creator_is function.';
END;
$block$ LANGUAGE PLPGSQL;

