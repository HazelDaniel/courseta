DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_course_creator function ...';

  CREATE OR REPLACE FUNCTION get_course_creator (course_id_ BIGINT) RETURNS
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
  DECLARE
    equiv_creator_id      UUID;
  BEGIN
    SELECT INTO equiv_creator_id courses.creator_id FROM courseta.courses
    WHERE courses.course_id = course_id_;

    RETURN QUERY SELECT creators.creator_id, creators.first_name, creators.last_name,
    creators.avatar_url, creators.average_course_rating, creators.course_count,
    creators.student_count, creators.course_review_count
    FROM creators WHERE creators.creator_id = equiv_creator_id;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_course_creator function.';
END
$block$ LANGUAGE PLPGSQL;
