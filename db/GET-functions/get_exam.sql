DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_exam function ...';

  CREATE OR REPLACE FUNCTION get_exam (exam_id_ UUID) RETURNS
  TABLE (
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    pass_score SMALLINT,
    duration SMALLINT,
    description VARCHAR,
    question_count SMALLINT,
    total_points INT
  ) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT exams.start_date, exams.end_date,
    exams.pass_score, exams.duration, exams.description, exams.question_count, exams.total_points
    FROM courseta.exams
    WHERE exams.exam_id = exam_id_;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_exam function.';
END
$block$ LANGUAGE PLPGSQL;
