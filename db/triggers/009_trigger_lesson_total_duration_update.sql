DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   TRIGGER: updating lesson.total_duration update triggers ...';

  CREATE OR REPLACE TRIGGER trigger_lesson_total_duration_insertion
  AFTER INSERT OR UPDATE OR DELETE
  ON lesson_contents
  FOR EACH ROW
  EXECUTE FUNCTION update_lesson_duration_and_content_count();

  RAISE NOTICE '[SETUP]   TRIGGER: DONE updating lesson.total_duration update triggers ...';
END
$block$ LANGUAGE PLPGSQL;