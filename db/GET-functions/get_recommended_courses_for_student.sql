DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_recommended_courses_for_student function ...';

  CREATE OR REPLACE FUNCTION get_recommended_courses_for_student (student_id_ UUID) RETURNS
  TABLE (
    title TEXT,
    lesson_count SMALLINT,
    avatar JSONB,
    course_id BIGINT
  ) AS
  $block1$
  DECLARE
    enrolled_courses_tags         VARCHAR[];
  BEGIN
    SELECT INTO enrolled_courses_tags COALESCE(p_02_aggregate_enrolled_course_tags_for_student(student_id_), ARRAY[]::VARCHAR[]);

    RETURN QUERY
    (WITH recommended_courses AS
    (SELECT
    DISTINCT ON (courses.course_id) courses.title, courses.lesson_count, courses.avatar, courses.course_id, students__courses.enrolled_at created_at
    FROM courseta.students__courses
    JOIN courseta.courses USING (course_id)
    WHERE students__courses.student_id <> student_id_
    AND courses.average_rating >= 4.0
    -- AND courses.student_count >= 1 (NO NEED TO CHECK THIS, THERE WON'T BE a corresponding students__courses if the student count is 0 so, empty set)
    AND courses.tags && enrolled_courses_tags),
    student_enrolled_courses AS
    (SELECT
    DISTINCT ON (courses.course_id) courses.course_id
    FROM courseta.students__courses
    JOIN courseta.courses USING (course_id)
    WHERE students__courses.student_id = student_id_
    )
    SELECT
      rc.title, rc.lesson_count, rc.avatar, rc.course_id
    FROM recommended_courses rc
    LEFT JOIN student_enrolled_courses sec USING (course_id)
    WHERE sec.course_id IS NULL
    ORDER BY rc.created_at AT TIME ZONE('UTC') DESC, rc.course_id
    LIMIT 10);
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_recommended_courses_for_student function.';
END
$block$ LANGUAGE PLPGSQL;
