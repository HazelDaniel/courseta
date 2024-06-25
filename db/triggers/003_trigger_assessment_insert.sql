DO
$block$
BEGIN
  -- RAISE NOTICE '[SETUP]   TRIGGER: updating assessment insertion triggers...';
  CREATE OR REPLACE TRIGGER trigger_exam_equiv_assessment_insert
  AFTER INSERT
  ON exams
  FOR EACH ROW
  EXECUTE FUNCTION insert_exam_equiv_assessment();

  CREATE OR REPLACE TRIGGER trigger_quiz_equiv_assessment_insert
  AFTER INSERT
  ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION insert_quiz_equiv_assessment();
  -- RAISE NOTICE '[SETUP]   TRIGGER: DONE updating assessment insertion triggers...';
END
$block$ LANGUAGE PLPGSQL
