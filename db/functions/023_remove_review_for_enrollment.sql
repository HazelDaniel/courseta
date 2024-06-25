DO
$block$
BEGIN

  CREATE OR REPLACE PROCEDURE delete_enrollment_equiv_review
  (course_id_ BIGINT, student_id_ UUID) LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    DELETE FROM courseta.reviews WHERE student_id = student_id_
    AND course_id = course_id_;
  END;
  $block2$;

  CREATE OR REPLACE FUNCTION remove_review_for_enrollment () RETURNS TRIGGER AS
  $block1$
  BEGIN
    CALL delete_enrollment_equiv_review(OLD.course_id, OLD.student_id);
    RETURN OLD;
  END;
  $block1$ LANGUAGE PLPGSQL;

END
$block$ LANGUAGE PLPGSQL;