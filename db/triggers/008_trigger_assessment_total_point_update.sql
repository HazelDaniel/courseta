DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   TRIGGER: updating assessments.total_points update triggers ...';

  CREATE OR REPLACE TRIGGER trigger_assesment_total_score_update
  AFTER UPDATE
  ON questions
  FOR EACH ROW
  EXECUTE FUNCTION update_points_and_question_count_on_assessment();

  RAISE NOTICE '<[SETUP]   TRIGGER: updating assessments.total_points addition triggers ...';

  CREATE OR REPLACE TRIGGER trigger_assesment_total_score_addition
  AFTER INSERT
  ON questions
  FOR EACH ROW
  EXECUTE FUNCTION add_points_and_question_count_to_assessment();

  RAISE NOTICE '<[SETUP]   TRIGGER: DONE updating assessments.total_points addition triggers ...';


  RAISE NOTICE '<[SETUP]   TRIGGER: updating assessments.total_points deletion triggers ...';

  CREATE OR REPLACE TRIGGER trigger_assesment_total_score_deletion
  BEFORE DELETE
  ON questions
  FOR EACH ROW
  EXECUTE FUNCTION remove_points_and_question_count_from_assessment();

  RAISE NOTICE '<[SETUP]   TRIGGER: DONE updating assessments.total_points deletion triggers ...';

  RAISE NOTICE '[SETUP]   TRIGGER: DONE updating assessments.total_points update triggers ...';
END
$block$ LANGUAGE PLPGSQL;