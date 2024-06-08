DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   TRIGGER: updating students.points update triggers (after update)...';
  CREATE OR REPLACE TRIGGER trigger_students__questions_points_accumulated_update
  AFTER UPDATE
  ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_student_rank_with_points();

  RAISE NOTICE '[SETUP]   TRIGGER: DONE updating students.points update triggers (after update)...';
END
$block$ LANGUAGE PLPGSQL;