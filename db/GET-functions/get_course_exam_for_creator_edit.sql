DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_course_exam_for_creator_edit function ...';

  CREATE OR REPLACE FUNCTION get_course_exam_for_creator_edit (course_id_ BIGINT) RETURNS
  TABLE (
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    pass_score SMALLINT,
    duration SMALLINT
  ) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT exams.start_date, exams.end_date,
    exams.pass_score, exams.duration
    FROM courseta.exams
    WHERE exams.course_id = course_id_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_course_exam_for_creator_edit function.';
END
$block$ LANGUAGE PLPGSQL;


