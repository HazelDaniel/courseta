DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_course_reviews function ...';

  CREATE OR REPLACE FUNCTION get_course_reviews (course_id_ BIGINT) RETURNS
  TABLE (
    review_text VARCHAR,
    rating NUMERIC,
    student_id UUID,
    created_at TIMESTAMPTZ,
    email VARCHAR
  ) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT reviews.review_text, reviews.rating, reviews.student_id,
    reviews.created_at, students.email
    FROM courseta.reviews
    JOIN courseta.students USING (student_id)
    WHERE reviews.course_id = course_id_
    ORDER BY reviews.created_at DESC;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_course_reviews function.';
END
$block$ LANGUAGE PLPGSQL;
