DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   TRIGGER: updating creator.[attribute] update triggers ...';

  RAISE NOTICE '<[SETUP]   TRIGGER: updating creator.course_review_count update triggers ...';

  CREATE OR REPLACE TRIGGER trigger_creator_review_count_update
  AFTER UPDATE
  ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_course_review_count_on_creator();

  RAISE NOTICE '<[SETUP]   TRIGGER: DONE updating creator.course_review_count update triggers ...';


  RAISE NOTICE '<[SETUP]   TRIGGER: updating creator.student_count update triggers ...';

  CREATE OR REPLACE TRIGGER trigger_creator_student_count_update
  AFTER UPDATE
  ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_student_count_on_creator();

  RAISE NOTICE '<[SETUP]   TRIGGER: DONE updating creator.student_count update triggers ...';

  RAISE NOTICE '[SETUP]   TRIGGER: DONE updating creator.[attribute] update triggers ...';
END
$block$ LANGUAGE PLPGSQL;