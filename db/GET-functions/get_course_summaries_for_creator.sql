DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_course_summaries_for_creator function ...';

  CREATE OR REPLACE FUNCTION get_course_summaries_for_creator (creator_id_ UUID) RETURNS
  TABLE (
    title TEXT,
    avatar TEXT,
    avatar_meta JSONB,
    course_id BIGINT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    tags VARCHAR[]
  ) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT courses.title, translate(encode(courses.avatar, 'base64'), E' \t\n\r', ''), courses.avatar_meta, courses.course_id,
    courses.created_at, courses.updated_at, courses.tags
    FROM courseta.courses WHERE courses.creator_id = creator_id_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_course_summaries_for_creator function.';
END
$block$ LANGUAGE PLPGSQL;

