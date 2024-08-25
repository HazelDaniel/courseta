DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_creator_top_courses function ...';

  CREATE OR REPLACE FUNCTION get_creator_top_courses (creator_id_ UUID) RETURNS
  TABLE (
    title TEXT,
    student_count INT,
    avatar TEXT,
    avatar_meta JSONB,
    course_id BIGINT
  ) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT courses.title, courses.student_count, translate(encode(courses.avatar, 'base64'), E'\r\t\n', ''), courses.avatar_meta, courses.course_id
    FROM courseta.courses
    WHERE courses.creator_id = creator_id_
    AND courses.archived = 'false'
    ORDER BY courses.student_count DESC
    LIMIT 5;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_creator_top_courses function.';
END
$block$ LANGUAGE PLPGSQL;
