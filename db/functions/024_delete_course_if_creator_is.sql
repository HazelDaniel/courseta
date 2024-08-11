DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (SET) FUNCTION: setting up the delete_course_if_creator_is function ...';

  CREATE OR REPLACE FUNCTION p_02_delete_course_if_creator_is (course_id_ BIGINT, creator_id_ UUID) RETURNS
  VOID AS
  $block1$
  DECLARE
    students_enrolled    BOOLEAN;
    equiv_course          RECORD;
  BEGIN
    SELECT INTO equiv_course courses.creator_id, courses.student_count FROM courseta.courses
    WHERE courses.course_id = course_id_;

    IF equiv_course.creator_id <> creator_id_ THEN
      RAISE EXCEPTION 'you cannot delete a course you didn''t create!';
    END IF;

    IF equiv_course.student_count > 0 THEN
      RAISE EXCEPTION 'cannot delete course since it has enrolled students, archive instead';
    END IF;

    DELETE FROM courseta.courses
    WHERE courses.creator_id = creator_id_ AND courses.course_id = course_id_;

  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (SET) FUNCTION: DONE setting up the delete_course_if_creator_is function.';
END;
$block$ LANGUAGE PLPGSQL;
