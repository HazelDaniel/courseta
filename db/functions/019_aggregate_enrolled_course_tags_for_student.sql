DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update of the courses tags for student.';

  CREATE OR REPLACE FUNCTION aggregate_enrolled_course_tags_for_student (student_id_ UUID)
  RETURNS VARCHAR[] AS
  $block1$
  DECLARE
    all_tags          VARCHAR[];
    entry                RECORD;
  BEGIN
    FOR entry IN SELECT tags FROM courseta.students__courses
    JOIN courseta.courses USING (course_id)
		WHERE students__courses.student_id = student_id_
    LOOP
      all_tags := all_tags || entry.tags;
    END LOOP;

    RETURN all_tags;
  END;
  $block1$ LANGUAGE PLPGSQL;
  

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update of the courses tags for student.';
END
$block$ LANGUAGE PLPGSQL;
