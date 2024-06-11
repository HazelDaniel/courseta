DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_course_summaries_for_student function ...';

  CREATE OR REPLACE FUNCTION get_course_summaries_for_student (student_id_ UUID) RETURNS
  TABLE (
    title TEXT,
    lesson_count SMALLINT,
    thumbnail TEXT,
    progress SMALLINT,
    course_id BIGINT
  ) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT courses.title, courses.lesson_count, courses.thumbnail,
    students__courses.progress, courses.course_id
    FROM courseta.students__courses
    JOIN courseta.courses USING (course_id) WHERE students__courses.student_id = student_id_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_course_summaries_for_student function.';
END
$block$ LANGUAGE PLPGSQL;
