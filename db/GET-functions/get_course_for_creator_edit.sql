DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_course_for_creator_edit function ...';

  CREATE OR REPLACE FUNCTION get_course_for_creator_edit (course_id_ BIGINT) RETURNS
  TABLE (
    title TEXT,
    description TEXT,
    avatar_url TEXT,
    tags VARCHAR[]
  ) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT courses.title, courses.description,
    courses.avatar->>'url', courses.tags
    FROM courseta.courses
    WHERE courses.course_id = course_id_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_course_for_creator_edit function.';
END
$block$ LANGUAGE PLPGSQL;

