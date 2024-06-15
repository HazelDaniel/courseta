DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   TRIGGER: updating students__assessments.total_points_accumulated update triggers...';
  CREATE OR REPLACE TRIGGER trigger_submission_total_points_update
  AFTER UPDATE
  ON students__questions
  FOR EACH ROW
  EXECUTE FUNCTION agg_questions_attempt_points_to_submission();

  RAISE NOTICE '[SETUP]   TRIGGER: DONE updating students__assessments.total_points_accumulated update triggers...';
END
$block$ LANGUAGE PLPGSQL;
