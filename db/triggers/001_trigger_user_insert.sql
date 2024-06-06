DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   TRIGGER: updating user insertion triggers...';
  CREATE OR REPLACE TRIGGER trigger_student_equiv_user_insert
  AFTER INSERT
  ON students
  FOR EACH ROW
  EXECUTE FUNCTION insert_student_equiv_user();

  CREATE OR REPLACE TRIGGER trigger_creator_equiv_user_insert
  AFTER INSERT
  ON creators
  FOR EACH ROW
  EXECUTE FUNCTION insert_creator_equiv_user();
  RAISE NOTICE '[SETUP]   TRIGGER: DONE updating user insertion triggers...';
END
$block$ LANGUAGE PLPGSQL
