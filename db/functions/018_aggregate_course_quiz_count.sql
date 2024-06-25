DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update of the course.quiz_count.';


  CREATE OR REPLACE PROCEDURE add_quiz_equiv_course_count
  (quiz_id_ UUID) LANGUAGE PLPGSQL AS
  $block2$
  DECLARE
    equiv_course_id       BIGINT;
  BEGIN
    SELECT INTO equiv_course_id course_id FROM quizzes
    JOIN lessons USING (lesson_id)
    JOIN courses USING (course_id)
    WHERE quizzes.quiz_id = quiz_id_;

    UPDATE courses SET quiz_count = (quiz_count + 1)
		WHERE courses.course_id = equiv_course_id;
  END;
  $block2$;

  CREATE OR REPLACE PROCEDURE subtract_quiz_equiv_lesson_count
  (quiz_id_ UUID) LANGUAGE PLPGSQL AS
  $block2$
  DECLARE
    equiv_course_id       BIGINT;
    equiv_lesson_id       BIGINT;
  BEGIN
    SELECT INTO equiv_course_id courses.course_id
    FROM courseta.quizzes
    JOIN courseta.lessons USING (lesson_id)
    JOIN courseta.courses USING (course_id)
    WHERE quizzes.quiz_id = quiz_id_;

    SELECT INTO equiv_lesson_id lessons.lesson_id
    FROM courseta.quizzes
    JOIN courseta.lessons USING (lesson_id)
    WHERE quizzes.quiz_id = quiz_id_;

    IF equiv_lesson_id IS NOT NULL AND equiv_course_id IS NOT NULL THEN
      UPDATE courses SET quiz_count = (quiz_count - 1)
      WHERE courses.course_id = equiv_course_id;
    END IF;
  END;
  $block2$;

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for addition to the course.quiz_count.';

  CREATE OR REPLACE FUNCTION add_quiz_count_to_course () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CALL add_quiz_equiv_course_count(NEW.quiz_id);
		RETURN NEW;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for addition to the course.quiz_count.';


  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for deduction from the course.quiz_count.';

  CREATE OR REPLACE FUNCTION remove_quiz_count_from_course () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CALL subtract_quiz_equiv_lesson_count(OLD.quiz_id);
		RETURN OLD;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for deduction from the course.quiz_count.';

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update of the course.quiz_count.';
END
$block$ LANGUAGE PLPGSQL;
