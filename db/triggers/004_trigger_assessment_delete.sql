DO
$block$
BEGIN
  -- RAISE NOTICE '[SETUP]   TRIGGER: updating assessment deletion triggers...';
  CREATE OR REPLACE TRIGGER trigger_exam_equiv_assessment_delete
  AFTER DELETE
  ON exams
  FOR EACH ROW
  EXECUTE FUNCTION delete_exam_equiv_assessment();

  CREATE OR REPLACE TRIGGER trigger_quiz_equiv_assessment_delete
  AFTER DELETE
  ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION delete_quiz_equiv_assessment();
  -- RAISE NOTICE '[SETUP]   TRIGGER: DONE updating assessment deletion triggers...';
END
$block$ LANGUAGE PLPGSQL

