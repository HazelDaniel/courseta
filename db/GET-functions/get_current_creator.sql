DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_current_creator function ...';

  CREATE OR REPLACE FUNCTION get_current_creator (email_ TEXT) RETURNS
  TABLE (creator_id UUID, email VARCHAR, role USER_ROLE_TYPE,
  avatar TEXT, avatar_meta JSONB, first_name VARCHAR, last_name VARCHAR, course_review_count INT,
  student_count INT, course_count INT, average_course_rating NUMERIC, created_at TIMESTAMPTZ) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT creators.creator_id, creators.email, creators.role, translate(encode(creators.avatar, 'base64'), E' \t\n\r', ''), creators.avatar_meta,
    creators.first_name, creators.last_name, creators.course_review_count, creators.student_count, creators.course_count,
    creators.average_course_rating, creators.created_at
    FROM creators
    WHERE creators.email = email_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE FUNCTION get_current_creator_validate (email_ TEXT) RETURNS
  TABLE (creator_id UUID, creator_pass TEXT, password TEXT, salt TEXT) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT creators.creator_id, creators.creator_pass, creators.password, creators.salt
    FROM creators
    WHERE creators.email = email_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_current_creator function.';
END
$block$ LANGUAGE PLPGSQL;