DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_creator_summaries function ...';

  CREATE OR REPLACE FUNCTION get_creator_summaries () RETURNS
  TABLE (
    creator_id UUID,
    email VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    avatar_url TEXT,
    average_course_rating  NUMERIC,
    course_count INT,
    student_count INT,
    course_review_count INT
  ) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT creators.creator_id, creators.email, creators.first_name, creators.last_name,
    creators.avatar->>'url' avatar_url , creators.average_course_rating, creators.course_count,
    creators.student_count, creators.course_review_count
    FROM creators;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_creator_summaries function.';
END
$block$ LANGUAGE PLPGSQL;