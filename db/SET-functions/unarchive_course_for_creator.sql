DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up the unarchive_course_for_creator function ...';

  CREATE OR REPLACE FUNCTION unarchive_course_for_creator (course_id_ BIGINT, creator_id_ UUID) RETURNS
  VOID AS
  $block1$
  DECLARE
    equiv_creator_id      UUID;
  BEGIN

    SELECT INTO equiv_creator_id courses.creator_id
    FROM courseta.courses
    WHERE courses.course_id = course_id_;

    IF equiv_creator_id <> creator_id_ THEN
      RAISE EXCEPTION 'you cannot unarchive a course you didn''t create!';
    END IF;

    UPDATE courseta.courses
    SET archived = false
    WHERE courses.course_id = course_id_;

  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up the unarchive_course_for_creator function.';
END;
$block$ LANGUAGE PLPGSQL;
