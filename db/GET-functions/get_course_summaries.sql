DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_course_summaries function ...';

  CREATE OR REPLACE FUNCTION get_course_summaries () RETURNS
  TABLE (
    title TEXT,
    lesson_count SMALLINT,
    avatar TEXT,
    avatar_meta JSONB,
    course_id BIGINT
  ) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT courses.title, courses.lesson_count, translate(encode(courses.avatar, 'base64'), E' \t\n\r', ''), courses.avatar_meta, courses.course_id
    FROM courseta.courses;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_course_summaries function.';
END
$block$ LANGUAGE PLPGSQL;
