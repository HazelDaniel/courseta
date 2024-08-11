DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION:  setting up the SET function to create a lessons with its quizzes and contents';

  CREATE OR REPLACE FUNCTION add_lessons_to_course(p_course_id BIGINT, lessons_data JSONB, quizzes_data JSONB, contents_data JSONB)
  RETURNS BIGINT[]
  AS
  $block1$
  DECLARE
    lesson_entry                            JSONB;
    created_lesson_id                      BIGINT;
    created_lesson_ids   BIGINT[] DEFAULT ARRAY[]::BIGINT[];
    quiz_entry                              JSONB;
    content_entry                           JSONB;
    created_quiz_id                          UUID;
  BEGIN
    -- unit of work: lesson creation

    -- process lessons
    FOR lesson_entry IN SELECT * FROM jsonb_array_elements(lessons_data) LOOP
      INSERT INTO courseta.lessons(title, course_id)
      VALUES (lesson_entry->>'title', p_course_id)
      RETURNING lesson_id INTO created_lesson_id;

      created_lesson_ids := created_lesson_ids || created_lesson_id;

      -- process quizzes for this lesson
      FOR quiz_entry IN SELECT * FROM jsonb_array_elements(quizzes_data) LOOP
        IF quiz_entry->>'lessonPositionID' = lesson_entry->>'positionID' THEN
          created_quiz_id := gen_random_uuid();
          INSERT INTO courseta.quizzes(lesson_id, quiz_title, description, pass_score, quiz_id)
          VALUES (
            created_lesson_id,
            quiz_entry->>'quizTitle',
            quiz_entry->>'description',
            (quiz_entry->>'passScore')::INT,
            created_quiz_id
          );
        END IF;
      END LOOP;

      -- process contents for this lesson
      FOR content_entry IN SELECT * FROM jsonb_array_elements(contents_data) LOOP
        IF content_entry->>'lessonPositionID' = lesson_entry->>'positionID' THEN
          INSERT INTO courseta.lesson_contents(lesson_id, title, href, content_type, duration)
          VALUES (
            created_lesson_id,
            content_entry->>'title',
            content_entry->>'href',
            (content_entry->>'contentType')::courseta.LESSON_CONTENT_TYPE,
            (content_entry->>'duration')::INT
          );
        END IF;
      END LOOP;
    END LOOP;

    RETURN created_lesson_ids;
    -- save unit of work

  EXCEPTION
    WHEN unique_violation THEN
      RAISE EXCEPTION 'Duplicate values provided that should be unique: %', SQLERRM;
    WHEN foreign_key_violation THEN
      RAISE EXCEPTION 'Some inputs are referencing non-existent columns: %', SQLERRM;
    WHEN others THEN
      RAISE EXCEPTION 'lesson creation failed. Check your inputs and try again: %', SQLERRM;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up the SET function to create a lessons with its quizzes and contents';
END;
$block$ LANGUAGE PLPGSQL;
