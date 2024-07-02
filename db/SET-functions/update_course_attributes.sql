DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up functions that update course info.';

  RAISE NOTICE '<[SETUP]   (SET) FUNCTION: setting up the update_course_attributes function ...';

  CREATE OR REPLACE FUNCTION update_course_attributes (course_data JSONB)
  RETURNS TABLE (thumbnail TEXT, description TEXT, tags VARCHAR[]) AS
  $block1$
  DECLARE
    new_tags       VARCHAR[] DEFAULT ARRAY[]::VARCHAR[];
  BEGIN
    new_tags := ARRAY(SELECT jsonb_array_elements_text(course_data->'tags'));

    RETURN QUERY 
    UPDATE courseta.courses
    SET thumbnail = COALESCE(course_data->>'thumbnail', courses.thumbnail), description = COALESCE(course_data->>'description', courses.description),
    tags = COALESCE(NULLIF(new_tags::VARCHAR[], ARRAY[]::VARCHAR[]), courses.tags)
    WHERE course_id = (course_data->>'courseID')::BIGINT
    RETURNING courses.thumbnail, courses.description, courses.tags;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '<[SETUP]   (SET) FUNCTION: DONE setting up the update_course_attributes function.';

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up functions that update course info.';

END;
$block$ LANGUAGE PLPGSQL;

