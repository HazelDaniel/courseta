DO
$block$
BEGIN
  -- RAISE NOTICE '[SETUP]   TRIGGER: updating students.points update triggers...';
  CREATE OR REPLACE TRIGGER trigger_01_student_points_update
  AFTER UPDATE
  ON students__assessments
  FOR EACH ROW
  EXECUTE FUNCTION p_02_agg_assessment_submission_points_to_student();

  -- RAISE NOTICE '[SETUP]   TRIGGER: DONE updating students.points update triggers...';
END
$block$ LANGUAGE PLPGSQL;
