DO
$block$
BEGIN
  -- RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update of the course.lesson_count.';

  -- RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for addition to the course.lesson_count.';

  CREATE OR REPLACE PROCEDURE add_lesson_equiv_course_count
  (course_id_ BIGINT) LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    UPDATE courses SET lesson_count = (lesson_count + 1)
    WHERE courses.course_id = course_id_;
  END;
  $block2$;

  CREATE OR REPLACE FUNCTION add_lesson_count_to_course () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CALL add_lesson_equiv_course_count(NEW.course_id);
		RETURN NEW;
  END;
  $block1$ LANGUAGE PLPGSQL;

  -- RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for addition to the course.review_count.';


  -- RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for deduction from the course.quiz_count.';

  CREATE OR REPLACE PROCEDURE subtract_quiz_equiv_lesson_count
  (lesson_id_ BIGINT) LANGUAGE PLPGSQL AS
  $block2$
  DECLARE
    equiv_course_id       BIGINT;
    equiv_quiz_id         UUID;
  BEGIN

    SELECT INTO equiv_quiz_id quizzes.quiz_id
    FROM courseta.quizzes
    JOIN courseta.lessons USING (lesson_id)
    WHERE lessons.lesson_id = lesson_id_;

    SELECT INTO equiv_course_id courses.course_id
    FROM courseta.quizzes
    JOIN courseta.lessons USING (lesson_id)
    JOIN courseta.courses USING (course_id)
    WHERE quizzes.quiz_id = equiv_quiz_id;

    IF equiv_quiz_id IS NOT NULL AND equiv_course_id IS NOT NULL THEN
      UPDATE courses SET quiz_count = (quiz_count - 1)
      WHERE courses.course_id = equiv_course_id;
    END IF;

  END;
  $block2$;

  CREATE OR REPLACE FUNCTION remove_equiv_quiz_count_from_course () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CALL subtract_quiz_equiv_lesson_count(OLD.lesson_id);
		RETURN OLD;
  END;
  $block1$ LANGUAGE PLPGSQL;



  -- RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for deduction from the course.lesson_count.';

  CREATE OR REPLACE PROCEDURE subtract_lesson_equiv_course_count
  (course_id_ BIGINT) LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    UPDATE courses SET lesson_count = (lesson_count - 1)
    WHERE courses.course_id = course_id_;
  END;
  $block2$;

  CREATE OR REPLACE FUNCTION remove_lesson_count_from_course () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CALL subtract_lesson_equiv_course_count(OLD.course_id);
		RETURN OLD;
  END;
  $block1$ LANGUAGE PLPGSQL;

  -- RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for deduction from the course.lesson_count.';

  -- RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update of the course.lesson_count.';
END
$block$ LANGUAGE PLPGSQL;
