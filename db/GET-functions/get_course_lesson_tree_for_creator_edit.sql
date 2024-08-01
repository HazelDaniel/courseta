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
    quiz_id UUID,
    total_points INT,
    quiz_title TEXT,
    content_title TEXT,
    content_type courseta.LESSON_CONTENT_TYPE
  ) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT lessons.lesson_id, lessons.title,
    lessons.content_count, lessons.total_duration, quizzes.quiz_id,
    quizzes.total_points, quizzes.quiz_title,
    lesson_contents.title content_title,
    lesson_contents.content_type
    FROM courseta.lessons
    LEFT JOIN courseta.quizzes USING (lesson_id)
    LEFT JOIN courseta.lesson_contents USING (lesson_id)
    WHERE lessons.course_id = course_id_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_course_lesson_tree_for_creator_edit function.';
END
$block$ LANGUAGE PLPGSQL;
