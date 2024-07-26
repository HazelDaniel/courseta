DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up functions that update course info.';

  RAISE NOTICE '<[SETUP]   (SET) FUNCTION: setting up the update_course_attributes function ...';

  CREATE OR REPLACE FUNCTION update_course_attributes (course_data JSONB)
  RETURNS TABLE (url TEXT, description TEXT, tags VARCHAR[]) AS
  $block1$
  DECLARE
    new_tags       VARCHAR[] DEFAULT ARRAY[]::VARCHAR[];
    old_avatar_url                                 TEXT;
  BEGIN
    new_tags := ARRAY(SELECT jsonb_array_elements_text(course_data->'tags'));

    SELECT INTO old_avatar_url courses.avatar->>'url' FROM courseta.courses
    WHERE courses.course_id = (course_data->>'courseID')::BIGINT;

		IF course_data->>'thumbnail' <> old_avatar_url THEN
			UPDATE courseta.courses
      SET avatar = avatar || ('{"url": "' || (course_data->>'thumbnail')::TEXT || '", "created_at": "' ||  courses.created_at::TEXT || '", "updated_at": "' || CURRENT_TIMESTAMP::TEXT || '"}')::JSONB
      WHERE course_id = (course_data->>'courseID')::BIGINT;
		END IF;

    RETURN QUERY 
    UPDATE courseta.courses
    SET description = COALESCE(course_data->>'description', courses.description),
    tags = COALESCE(NULLIF(new_tags::VARCHAR[], ARRAY[]::VARCHAR[]), courses.tags)
    WHERE course_id = (course_data->>'courseID')::BIGINT
    RETURNING courses.avatar->>'url', courses.description, courses.tags;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '<[SETUP]   (SET) FUNCTION: DONE setting up the update_course_attributes function.';

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up functions that update course info.';

END;
$block$ LANGUAGE PLPGSQL;

