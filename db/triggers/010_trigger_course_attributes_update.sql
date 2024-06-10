DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   TRIGGER: updating course.[attribute] update triggers ...';

  RAISE NOTICE '<[SETUP]   TRIGGER: updating course.student_count addition triggers ...';

  CREATE OR REPLACE TRIGGER trigger_course_student_count_addition
  AFTER INSERT
  ON students__courses
  FOR EACH ROW
  EXECUTE FUNCTION add_student_count_to_course();

  RAISE NOTICE '<[SETUP]   TRIGGER: DONE updating course.student_count addition triggers ...';


  RAISE NOTICE '<[SETUP]   TRIGGER: updating course._student_count deduction triggers ...';

  CREATE OR REPLACE TRIGGER trigger_course_student_count_removal
  AFTER DELETE
  ON students__courses
  FOR EACH ROW
  EXECUTE FUNCTION remove_student_count_from_course();

  RAISE NOTICE '<[SETUP]   TRIGGER: DONE updating course._student_count deduction triggers ...';


  RAISE NOTICE '<[SETUP]   TRIGGER: updating course.review_count addition triggers ...';

  CREATE OR REPLACE TRIGGER trigger_course_review_count_addition
  AFTER INSERT
  ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION add_review_count_to_course();

  RAISE NOTICE '<[SETUP]   TRIGGER: DONE updating course.review_count addition triggers ...';


  RAISE NOTICE '<[SETUP]   TRIGGER: updating course.review_count deduction triggers ...';

  CREATE OR REPLACE TRIGGER trigger_course_review_count_removal
  AFTER DELETE
  ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION remove_review_count_from_course();

  RAISE NOTICE '<[SETUP]   TRIGGER: DONE updating course.review_count deduction triggers ...';


  RAISE NOTICE '<[SETUP]   TRIGGER: updating course.lesson_count addition triggers ...';

  CREATE OR REPLACE TRIGGER trigger_course_lesson_count_addition
  AFTER INSERT
  ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION add_lesson_count_to_course();

  RAISE NOTICE '<[SETUP]   TRIGGER: DONE updating course.review_count addition triggers ...';


  RAISE NOTICE '<[SETUP]   TRIGGER: updating course.lesson_count deduction triggers ...';

  CREATE OR REPLACE TRIGGER trigger_course_lesson_count_removal
  AFTER DELETE
  ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION remove_lesson_count_from_course();

  RAISE NOTICE '<[SETUP]   TRIGGER: DONE updating course.lesson_count deduction triggers ...';


  RAISE NOTICE '<[SETUP]   TRIGGER: updating course.progress update triggers ...';

  CREATE OR REPLACE TRIGGER trigger_course_progress_update
  AFTER INSERT
  ON students__assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_equiv_course_progress();

  RAISE NOTICE '<[SETUP]   TRIGGER: DONE updating course.progress update triggers ...';


  RAISE NOTICE '<[SETUP]   TRIGGER: updating course.quiz_count increment triggers ...';

  CREATE OR REPLACE TRIGGER trigger_course_quiz_count_increment
  AFTER INSERT
  ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION add_quiz_count_to_course();

  RAISE NOTICE '<[SETUP]   TRIGGER: DONE updating course.quiz_count increment triggers ...';

  RAISE NOTICE '<[SETUP]   TRIGGER: updating course.quiz_count decrement triggers ...';

  CREATE OR REPLACE TRIGGER trigger_course_quiz_count_decrement
  AFTER DELETE
  ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION remove_quiz_count_from_course();

  RAISE NOTICE '<[SETUP]   TRIGGER: DONE updating course.quiz_count decrement triggers ...';

  RAISE NOTICE '[SETUP]   TRIGGER: DONE updating course.[attribute] update triggers ...';
END
$block$ LANGUAGE PLPGSQL;