DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_course_lesson_tree_for_creator_edit function ...';

  CREATE OR REPLACE FUNCTION get_course_lesson_tree_for_creator_edit (course_id_ BIGINT) RETURNS
  TABLE (
    lesson_id BIGINT,
    title VARCHAR,
    content_count SMALLINT,
    total_duration SMALLINT,
    contents JSONB,
    quizzes JSONB
  ) AS
  $block1$
  BEGIN

    RETURN QUERY SELECT lessons.lesson_id, lessons.title,
    lessons.content_count, lessons.total_duration,
    json_agg(json_build_object(
      'title', q.quiz_title,
      'totalPoints', q.total_points,
      'id', q.quiz_id
    ))::JSONB quizzes,
    json_agg(json_build_object(
      'title', lc.title,
      'contentType', lc.content_type,
      'id', lc.lesson_content_id
    ))::JSONB contents
    FROM courseta.lessons
    LEFT JOIN courseta.quizzes q USING (lesson_id)
    LEFT JOIN courseta.lesson_contents lc USING (lesson_id)
    WHERE lessons.course_id = course_id_
    GROUP BY lessons.lesson_id, lessons.title,
    lessons.content_count, lessons.total_duration;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_course_lesson_tree_for_creator_edit function.';
END
$block$ LANGUAGE PLPGSQL;
