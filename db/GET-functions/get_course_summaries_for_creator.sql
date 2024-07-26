DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_course_summaries_for_creator function ...';

  CREATE OR REPLACE FUNCTION get_course_summaries_for_creator (creator_id_ UUID) RETURNS
  TABLE (
    title TEXT,
    lesson_count SMALLINT,
    avatar JSONB,
    course_id BIGINT,
    average_rating NUMERIC,
    student_count INT
  ) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT courses.title, courses.lesson_count, courses.avatar, courses.course_id, courses.average_rating, courses.student_count
    FROM courseta.courses WHERE courses.creator_id = creator_id_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_course_summaries_for_creator function.';
END
$block$ LANGUAGE PLPGSQL;

