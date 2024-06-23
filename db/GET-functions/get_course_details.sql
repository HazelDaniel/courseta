DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_course_details function ...';

  CREATE OR REPLACE FUNCTION get_course_details (course_id_ BIGINT) RETURNS
  TABLE (
    title TEXT,
    lesson_count SMALLINT,
    description TEXT,
    review_count INT,
    thumbnail TEXT,
    creator_id UUID,
    student_count INT,
    updated_at TIMESTAMPTZ,
    course_length INT,
    average_rating NUMERIC
  ) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT courses.title, courses.lesson_count, courses.description, courses.review_count,
    courses.thumbnail, courses.creator_id, courses.student_count, courses.updated_at, courses.course_length, courses.average_rating
    FROM courseta.courses
    WHERE courses.course_id = course_id_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_course_details function.';
END
$block$ LANGUAGE PLPGSQL;