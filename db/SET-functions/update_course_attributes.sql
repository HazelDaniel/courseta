DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up functions that update course info.';

  RAISE NOTICE '<[SETUP]   (SET) FUNCTION: setting up the update_course_attributes function ...';

  CREATE OR REPLACE FUNCTION update_course_attributes (course_data JSONB)
  RETURNS TABLE (url TEXT, meta JSONB, description TEXT, tags VARCHAR[]) AS
  $block1$
  DECLARE
    new_tags       VARCHAR[] DEFAULT ARRAY[]::VARCHAR[];
    old_avatar_url                                BYTEA;
    new_updated_time                         TIMESTAMPTZ;
  BEGIN
    new_tags := ARRAY(SELECT jsonb_array_elements_text(course_data->'tags'));

    SELECT INTO old_avatar_url courses.avatar FROM courseta.courses
    WHERE courses.course_id = (course_data->>'courseID')::BIGINT;

		IF decode((course_data->>'thumbnail'), 'base64')::BYTEA <> old_avatar_url THEN
			UPDATE courseta.courses
      SET avatar_meta = COALESCE(avatar_meta, '{}'::JSONB) || ('{"created_at": "' ||  courses.created_at::TEXT || '", "updated_at": "' || CURRENT_TIMESTAMP::TEXT || '", "id": "' || (course_data->'avatar'->>'id')::UUID || '", "mime_type": "' || (course_data->'avatar'->>'mimeType') || '"}')::JSONB,
      avatar = COALESCE(decode((course_data->>'thumbnail'), 'base64')::BYTEA, avatar)
      WHERE course_id = (course_data->>'courseID')::BIGINT;
		END IF;

    RETURN QUERY 
    UPDATE courseta.courses
    SET description = COALESCE(course_data->>'description', courses.description),
    title = COALESCE(course_data->>'title', courses.title),
    tags = COALESCE(NULLIF(new_tags::VARCHAR[], ARRAY[]::VARCHAR[]), courses.tags), updated_at = CURRENT_TIMESTAMP
    WHERE course_id = (course_data->>'courseID')::BIGINT
    RETURNING translate(encode(courses.avatar, 'base64'), E' \t\n\r', ''), courses.avatar_meta, courses.description, courses.tags;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '<[SETUP]   (SET) FUNCTION: DONE setting up the update_course_attributes function.';

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up functions that update course info.';

END;
$block$ LANGUAGE PLPGSQL;

