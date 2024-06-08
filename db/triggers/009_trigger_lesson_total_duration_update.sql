DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   TRIGGER: updating lesson.total_duration update triggers ...';

  RAISE NOTICE '<[SETUP]   TRIGGER: updating lesson.total_duration addition triggers ...';

  CREATE OR REPLACE TRIGGER trigger_lesson_total_duration_insertion
  AFTER INSERT
  ON lesson_contents
  FOR EACH ROW
  EXECUTE FUNCTION add_total_duration_and_content_count_to_lesson();

  RAISE NOTICE '<[SETUP]   TRIGGER: DONE updating lesson.total_duration addition triggers ...';


  RAISE NOTICE '<[SETUP]   TRIGGER: updating lesson.total_duration deletion triggers ...';

  CREATE OR REPLACE TRIGGER trigger_lesson_total_duration_deletion
  AFTER DELETE
  ON lesson_contents
  FOR EACH ROW
  EXECUTE FUNCTION remove_total_duration_and_content_count_from_lesson();

  RAISE NOTICE '<[SETUP]   TRIGGER: DONE updating lesson.total_duration deletion triggers ...';

  RAISE NOTICE '[SETUP]   TRIGGER: DONE updating lesson.total_duration update triggers ...';
END
$block$ LANGUAGE PLPGSQL;