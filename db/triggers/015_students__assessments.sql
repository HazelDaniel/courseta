-- DO
-- $block$
-- BEGIN
--   -- RAISE NOTICE '[SETUP]   TRIGGER: updating students.points update triggers...';

  CREATE OR REPLACE TRIGGER trigger_0c_assessment_points_update
  AFTER INSERT
  ON students__assessments
  FOR EACH ROW
  EXECUTE FUNCTION p_03_run_submission_effect();

  CREATE OR REPLACE TRIGGER trigger_0b_student_points_recalc
  BEFORE DELETE
  ON students__assessments
  FOR EACH ROW
  EXECUTE FUNCTION p_03_agg_re_calculate_student_point();

  CREATE OR REPLACE TRIGGER trigger_0d_student_points_recalc
  BEFORE DELETE
  ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION p_04_agg_re_calc_course_progress_using_quiz();

-- -- RAISE NOTICE '[SETUP]   TRIGGER: updating students.points update triggers...';
-- END;
-- $block$ LANGUAGE PLPGSQL;
