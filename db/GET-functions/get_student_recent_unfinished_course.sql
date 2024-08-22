DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_student_recent_unfinished_course function ...';

  CREATE OR REPLACE FUNCTION get_student_recent_unfinished_course (student_id_ UUID) RETURNS
  TABLE (
    title TEXT,
    lesson_count SMALLINT,
    avatar TEXT,
    avatar_meta JSONB,
    progress SMALLINT,
    course_id BIGINT
  ) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT courses.title, courses.lesson_count, translate(encode(courses.avatar, 'base64'), E' \t\n\r', ''), courses.avatar_meta,
    students__courses.progress, courses.course_id
    FROM courseta.students__courses
    JOIN courseta.courses USING (course_id) WHERE students__courses.student_id = student_id_
    AND courseta.students__courses.progress < 100
    ORDER BY courseta.students__courses.enrolled_at AT TIME ZONE ('UTC') DESC
    LIMIT 5;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_student_recent_unfinished_course function.';
END
$block$ LANGUAGE PLPGSQL;
