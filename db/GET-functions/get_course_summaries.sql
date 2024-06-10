DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_course_summaries function ...';

  CREATE OR REPLACE FUNCTION get_course_summaries () RETURNS
  TABLE (
    title TEXT,
    lesson_count SMALLINT,
    thumbnail TEXT,
    progress SMALLINT
  ) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT courses.title, courses.lesson_count, courses.thumbnail,
    students__courses.progress
    FROM courseta.courses
    LEFT JOIN courseta.students__courses USING (course_id);
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_course_summaries function.';
END
$block$ LANGUAGE PLPGSQL;
