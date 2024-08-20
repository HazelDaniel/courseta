DO
$block$
BEGIN

-- -- RAISE NOTICE '<[SETUP]   TRIGGER: updating course.quiz_count decrement triggers ...';

  CREATE OR REPLACE TRIGGER trigger_course_exam_id_update
  AFTER INSERT
  ON exams
  FOR EACH ROW
  EXECUTE FUNCTION p_02_set_course_exam_id();

--   -- RAISE NOTICE '<[SETUP]   TRIGGER: DONE updating course.quiz_count decrement triggers ...';

END
$block$ LANGUAGE PLPGSQL;
