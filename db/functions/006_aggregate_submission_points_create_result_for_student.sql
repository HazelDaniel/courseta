DO
$block$
BEGIN
  -- RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update on the students.points column.';

  CREATE OR REPLACE FUNCTION p_02_deduct_student_existing_points (student_id_ UUID, assessment_id_ UUID, submitted_at_ TIMESTAMPTZ)
  RETURNS VOID AS
  $block1$
  DECLARE
    retake_points          INT DEFAULT 0;
  BEGIN
    WITH retakes AS (
      SELECT total_points_accumulated,
      ROW_NUMBER() OVER (PARTITION BY assessment_id ORDER BY submitted_at DESC) retake_number
      FROM students__assessments
      WHERE students__assessments.student_id = student_id_
  		AND students__assessments.assessment_id = assessment_id_
    )
    SELECT INTO retake_points COALESCE(SUM(total_points_accumulated), 0) FROM retakes
    WHERE retake_number = 2;

    -- RAISE EXCEPTION 'retake points is %', retake_points;

    UPDATE students SET points = (points - retake_points)
    WHERE students.student_id = student_id_; -- deducting existing retake points from the students points
  END;
  $block1$ LANGUAGE PLPGSQL;



  CREATE OR REPLACE PROCEDURE p_02_deduct_student_last_points_on (student_id_ UUID, assessment_id_ UUID, submitted_at_ TIMESTAMPTZ)
  LANGUAGE PLPGSQL AS
  $block1$
  DECLARE
    last_points           INT DEFAULT 0;
    debug_student_points_ INT DEFAULT 0;
    last_attempt                 RECORD;
  BEGIN

    SELECT INTO last_attempt se.submitted_at, se.assessment_id
    FROM students__assessments se
    WHERE se.assessment_id = assessment_id_
    AND se.student_id = student_id_
    ORDER BY submitted_at DESC;

    IF last_attempt.submitted_at <> submitted_at_ OR last_attempt.assessment_id <> assessment_id_ THEN
      RETURN; -- we are basically working with last submissions of all quizzes
    END IF;

    SELECT INTO last_points COALESCE(total_points_accumulated, 0)
    FROM students__assessments
    WHERE students__assessments.student_id = student_id_
  	AND students__assessments.assessment_id = assessment_id_
  	ORDER BY submitted_at DESC LIMIT 1;

  	SELECT INTO debug_student_points_ points
  	FROM courseta.students
  	WHERE students.student_id = student_id_; -- deducting existing retake points from the students points

  	RAISE NOTICE 'last points is , %, while student point is %', last_points, debug_student_points_;
  	-- RAISE EXCEPTION 'last points is , %', last_points;

    UPDATE students SET points = (points - last_points)
    WHERE students.student_id = student_id_; -- deducting existing retake points from the students points
  END;
  $block1$;


  CREATE OR REPLACE FUNCTION p_03_agg_re_calculate_student_point () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CALL p_02_deduct_student_last_points_on(OLD.student_id, OLD.assessment_id, OLD.submitted_at);
    RETURN OLD;
  END;
  $block1$ LANGUAGE PLPGSQL;


  CREATE OR REPLACE FUNCTION p_04_agg_re_calc_course_progress_using_quiz () RETURNS TRIGGER AS
  $block1$
  DECLARE
  submission_entry        RECORD;
  BEGIN
    FOR submission_entry IN (
    WITH all_last_attempts_on AS (
    SELECT ROW_NUMBER() OVER (PARTITION BY assessment_id ORDER BY submitted_at DESC),
    assessment_id, student_id, submitted_at FROM students__assessments
    JOIN quizzes USING (assessment_id) WHERE quiz_id = OLD.quiz_id
    )
    SELECT assessment_id, student_id, submitted_at FROM all_last_attempts_on
    WHERE ROW_NUMBER = 1) LOOP
      RAISE NOTICE 'submission entry is %', submission_entry;
      CALL p_01_deduct_course_progress_from_assessment(submission_entry.assessment_id, submission_entry.student_id, submission_entry.submitted_at);
    END LOOP;
    RETURN OLD;
  END;
  $block1$ LANGUAGE PLPGSQL;


------------------------------------ DEBUGGING---------------------------------------------
  CREATE OR REPLACE VIEW debug_recent_submission_points as (
  SELECT ROW_NUMBER () OVER (PARTITION BY assessment_id ORDER BY submitted_at DESC), total_points_accumulated, assessment_id FROM students__assessments
  );

  -- RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update on the students.points column.';

END
$block$ LANGUAGE PLPGSQL;
