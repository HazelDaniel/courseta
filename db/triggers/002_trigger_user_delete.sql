DO
$block$
BEGIN
  -- RAISE NOTICE '[SETUP]   TRIGGER: updating user deletion triggers...';
  CREATE OR REPLACE TRIGGER trigger_student_equiv_user_delete
  AFTER DELETE
  ON students
  FOR EACH ROW
  EXECUTE FUNCTION delete_student_equiv_user();

  CREATE OR REPLACE TRIGGER trigger_creator_equiv_user_delete
  AFTER DELETE
  ON creators
  FOR EACH ROW
  EXECUTE FUNCTION delete_creator_equiv_user();
  -- RAISE NOTICE '[SETUP]   TRIGGER: DONE updating user deletion triggers...';
END
$block$ LANGUAGE PLPGSQL
