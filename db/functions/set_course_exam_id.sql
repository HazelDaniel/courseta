DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for course exam id update.';

  CREATE OR REPLACE PROCEDURE p_01_update_exam_id_on_course (course_id_ BIGINT, exam_id_ UUID)
  LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    UPDATE courseta.courses SET exam_id = exam_id_
    WHERE courses.course_id = course_id_;
  END;
  $block2$;

  CREATE OR REPLACE FUNCTION p_02_set_course_exam_id () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CALL p_01_update_exam_id_on_course(NEW.course_id, NEW.exam_id);
    RETURN NEW;
  END;
  $block1$
  LANGUAGE PLPGSQL;
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for course exam id update.';

END
$block$ LANGUAGE PLPGSQL;
