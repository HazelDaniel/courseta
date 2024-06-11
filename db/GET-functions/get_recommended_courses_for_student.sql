DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_recommended_courses_for_student function ...';

  CREATE OR REPLACE FUNCTION get_recommended_courses_for_student (student_id_ UUID) RETURNS
  TABLE (
    title TEXT,
    lesson_count SMALLINT,
    thumbnail TEXT,
    course_id BIGINT
  ) AS
  $block1$
  DECLARE
    enrolled_courses_tags         VARCHAR[];
  BEGIN
    SELECT INTO enrolled_courses_tags COALESCE(aggregate_enrolled_course_tags_for_student(student_id_), ARRAY[]::VARCHAR[]);

    RAISE NOTICE 'enrolled courses tags are : %', enrolled_courses_tags;

    -- TODO: make this a distinct seletion based on the id field
    RETURN QUERY SELECT
    DISTINCT ON (courses.course_id) courses.title, courses.lesson_count, courses.thumbnail, courses.course_id
    FROM courseta.students__courses
    JOIN courseta.courses USING (course_id)
    JOIN courseta.reviews USING (course_id)
    WHERE students__courses.student_id <> student_id_
    AND reviews.rating >= '4'
    AND courses.tags && enrolled_courses_tags
    ORDER BY courses.course_id,  courses.created_at AT TIME ZONE('UTC') DESC;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_recommended_courses_for_student function.';
END
$block$ LANGUAGE PLPGSQL;