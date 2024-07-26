-- DO
-- $block$
-- BEGIN
--   RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up the SET function to upsert a course with its other dependent entities';
--   -- NOTE: might not need this function since the client is not built to handle all these operation on a course update
--   -- TODO: if you'll need it then, fix the code.

--   CREATE OR REPLACE FUNCTION upsert_course_for_creator(p_creator_id UUID, course_data JSONB, lessons_data JSONB,
--   quizzes_data JSONB, contents_data JSONB)
--   RETURNS BIGINT
--   AS
--   $block1$
--   DECLARE
--     created_course_id         BIGINT;
--     lesson_entry               JSONB;
--     created_lesson_id         BIGINT;
--     quiz_entry                 JSONB;
--     content_entry              JSONB;
--     created_quiz_id             UUID;
--     avatar_json                JSONB;
--   BEGIN
--     -- unit of work: course creation

--     avatar_json := json_build_object(
--     'url', course_data->>'thumbnail',
--     'created_at', to_json(CURRENT_TIMESTAMP),
--     'updated_at', to_json(CURRENT_TIMESTAMP)
--     );

--     INSERT INTO courseta.courses(title, description, avatar, creator_id, tags)
--     VALUES (
--       course_data->>'title',
--       course_data->>'description',
--       avatar_json,
--       p_creator_id,
--       COALESCE(ARRAY (SELECT jsonb_array_elements_text(course_data->'tags')), ARRAY[]::VARCHAR[])
--     ) ON CONFLICT DO UPDATE SET courses.updated_at = CURRENT_TIMESTAMP::TIMESTAMPTZ
--     RETURNING course_id INTO created_course_id;

--     -- process lessons
--     FOR lesson_entry IN SELECT * FROM jsonb_array_elements(lessons_data) LOOP
--       INSERT INTO courseta.lessons(title, course_id)
--       VALUES (lesson_entry->>'title', created_course_id)
--       RETURNING lesson_id INTO created_lesson_id;

--       -- process quizzes for this lesson
--       FOR quiz_entry IN SELECT * FROM jsonb_array_elements(quizzes_data) LOOP
--         IF quiz_entry->>'lessonPositionID' = lesson_entry->>'positionID' THEN
--           created_quiz_id := gen_random_uuid();
--           INSERT INTO courseta.quizzes(lesson_id, quiz_title, description, pass_score, quiz_id)
--           VALUES (
--             created_lesson_id,
--             quiz_entry->>'quizTitle',
--             quiz_entry->>'description',
--             (quiz_entry->>'passScore')::INT,
--             created_quiz_id
--           );
--         END IF;
--       END LOOP;

--       -- process contents for this lesson
--       FOR content_entry IN SELECT * FROM jsonb_array_elements(contents_data) LOOP
--         IF content_entry->>'lessonPositionID' = lesson_entry->>'positionID' THEN
--           INSERT INTO courseta.lesson_contents(lesson_id, title, href, content_type, duration)
--           VALUES (
--             created_lesson_id,
--             content_entry->>'title',
--             content_entry->>'href',
--             (content_entry->>'contentType')::courseta.LESSON_CONTENT_TYPE,
--             (content_entry->>'duration')::INT
--           );
--         END IF;
--       END LOOP;
--     END LOOP;

--     RETURN created_course_id;
--     -- save unit of work

--   EXCEPTION
--     WHEN unique_violation THEN
--       RAISE EXCEPTION 'Duplicate values provided that should be unique: %', SQLERRM;
--     WHEN foreign_key_violation THEN
--       RAISE EXCEPTION 'Some inputs are referencing non-existent columns: %', SQLERRM;
--     WHEN others THEN
--       RAISE EXCEPTION 'Course creation failed. Check your inputs and try again: %', SQLERRM;
--   END;
--   $block1$ LANGUAGE PLPGSQL;

--   RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up the SET function to upsert a course with its other dependent entities';
-- END;
-- $block$ LANGUAGE PLPGSQL;

