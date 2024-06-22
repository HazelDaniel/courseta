DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up the set_new_course function ...';

  CREATE OR REPLACE FUNCTION set_new_course (
    title_ TEXT,
    description_ TEXT,
    thumbnail_ TEXT,
    creator_id_ UUID,
    tags_ VARCHAR[]
  ) RETURNS
  TABLE (course_id BIGINT) AS
  $block1$
  BEGIN
    RETURN QUERY
    INSERT INTO courseta.courses (title, description, thumbnail, creator_id, tags)
    VALUES (title_, description_, thumbnail_, creator_id_, tags_)
    RETURNING courses.course_id;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up the set_new_course function.';
END;
$block$ LANGUAGE PLPGSQL;
