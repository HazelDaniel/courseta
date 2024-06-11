DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for updating courses.[quiz_count].';

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for increasing courses.[quiz_count].';

  CREATE OR REPLACE FUNCTION increase_equiv_course_quiz_count () RETURNS TRIGGER AS
  $block1$
    BEGIN
      CALL increase_quiz_count_for_course(NEW.lesson_id);
      RETURN NEW;
    END;
  $block1$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE PROCEDURE increase_quiz_count_for_course (lesson_id_ BIGINT)
  LANGUAGE PLPGSQL AS
  $block2$
  DECLARE
    course_id_var       BIGINT;
  BEGIN
    SELECT INTO course_id_var courses.course_id FROM courseta.lessons
    JOIN courseta.courses USING (course_id)
    WHERE lessons.lesson_id = lesson_id_;

    UPDATE courseta.courses SET quiz_count = quiz_count + 1
		WHERE courses.course_id = course_id_var;
  END;
  $block2$;

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for increasing courses.[quiz_count].';


  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for deducting courses.[quiz_count].';

  CREATE OR REPLACE FUNCTION decrease_equiv_course_quiz_count () RETURNS TRIGGER AS
  $block1$
    BEGIN
      CALL decrease_quiz_count_for_course(OLD.lesson_id);
      RETURN OLD;
    END;
  $block1$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE PROCEDURE decrease_quiz_count_for_course (lesson_id_ BIGINT)
  LANGUAGE PLPGSQL AS
  $block2$
  DECLARE
    course_id_var       BIGINT;
  BEGIN
    SELECT INTO course_id_var course_id FROM (SELECT lessons.lesson_id FROM courseta.lessons
    JOIN courseta.courses ON (course_id)
    WHERE lessons.lesson_id = lesson_id_) AS RES;

    UPDATE courseta.courses SET quiz_count = quiz_count - 1
		WHERE courses.course_id = course_id_var;
  END;
  $block2$;

  RAISE NOTICE '<[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for deducting courses.[quiz_count].';

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for updating courses.[quiz_count].';

END
$block$ LANGUAGE PLPGSQL;
