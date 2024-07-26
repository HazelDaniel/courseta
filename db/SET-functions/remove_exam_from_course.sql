DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up the remove_exam_from_course function ...';

  CREATE OR REPLACE PROCEDURE remove_exam_from_course (course_id_ BIGINT)
  LANGUAGE PLPGSQL AS
  $block1$
  BEGIN
    DELETE from courseta.exams WHERE exams.course_id = course_id_;
  END;
  $block1$;

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up the remove_exam_from_course function.';
END
$block$ LANGUAGE PLPGSQL;
