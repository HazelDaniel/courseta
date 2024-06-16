DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up the review_course_for_student function ...';

  CREATE OR REPLACE FUNCTION review_course_for_student (student_id_ UUID, course_id_ BIGINT, rating_ NUMERIC, review_text_ VARCHAR) RETURNS
  VOID AS
  $block1$
  DECLARE
    student_review_occurrence        SMALLINT;
    student_enroll_occurrence        SMALLINT;
  BEGIN
    SELECT INTO student_review_occurrence COUNT(*) FROM courseta.reviews
    WHERE reviews.student_id = student_id_
    AND reviews.course_id = course_id_;

    SELECT INTO student_enroll_occurrence COUNT (*) FROM courseta.students__courses
    WHERE student_id = student_id_
    AND course_id = course_id_;

    RAISE NOTICE '[debug]: this user has reviewed course id: %, % times', course_id_, student_review_occurrence;
    IF student_enroll_occurrence >= 1 AND student_review_occurrence <= 1 THEN
      INSERT INTO courseta.reviews(student_id, course_id, rating, review_text)
      VALUES (student_id_, course_id_, rating_, review_text_)
      ON CONFLICT (student_id, course_id) DO UPDATE
      SET rating = EXCLUDED.rating, review_text = EXCLUDED.review_text, created_at = CURRENT_TIMESTAMP;
    ELSE
      RAISE EXCEPTION 'this student [%] cannot make review! on course id : %', student_id_, course_id_;
    END IF;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up the review_course_for_student function.';
END;
$block$ LANGUAGE PLPGSQL;
