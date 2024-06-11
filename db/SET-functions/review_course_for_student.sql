DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up the review_course_for_student function ...';

  CREATE OR REPLACE FUNCTION review_course_for_student (student_id_ UUID, course_id_ BIGINT, rating_ courseta.REVIEW_RATING) RETURNS
  VOID AS
  $block1$
  DECLARE
    enrolled          SMALLINT;
  BEGIN
    SELECT INTO enrolled COUNT(*) FROM courseta.students__courses
    WHERE students__courses.student_id = student_id_;

    IF enrolled >= 1 THEN
      INSERT INTO courseta.reviews(student_id, course_id, rating)
      VALUES (student_id_, course_id_, rating_);
    ELSE
      RAISE NOTICE 'this student cannot make review. please enroll first!';
    END IF;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up the review_course_for_student function.';
END;
$block$ LANGUAGE PLPGSQL;
