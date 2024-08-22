DO
$block$
BEGIN
  -- RAISE NOTICE '[SETUP]   TRIGGER: updating students__questions.points_accumulated update triggers...';

  CREATE OR REPLACE TRIGGER trigger_students__questions_points_accumulated_update
  AFTER INSERT
  ON students__questions
  FOR EACH ROW
  EXECUTE FUNCTION p_02_agg_answer_submission_points_to_question();

  CREATE OR REPLACE TRIGGER trigger_students__answer_points_accumulation
  AFTER INSERT
  ON students__answers
  FOR EACH ROW
  EXECUTE FUNCTION p_02_agg_answer_submission_points();
  -- RAISE NOTICE '[SETUP]   TRIGGER: DONE updating students__questions.points_accumulated update triggers...';
END
$block$ LANGUAGE PLPGSQL;
