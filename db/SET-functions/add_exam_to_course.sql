DO
$block$
BEGIN
CREATE OR REPLACE FUNCTION add_exam_to_course (p_course_id BIGINT, p_description TEXT,
p_pass_score SMALLINT, p_duration SMALLINT, p_start_date TIMESTAMPTZ, p_end_date TIMESTAMPTZ) RETURNS UUID
AS
$block1$
  DECLARE
    created_exam_id           UUID;
  BEGIN
    INSERT INTO exams (course_id, description, pass_score, duration, start_date, end_date)
    VALUES (p_course_id, p_description, p_pass_score, p_duration, p_start_date, p_end_date) RETURNING exam_id INTO created_exam_id;

    RETURN created_exam_id;

  EXCEPTION
    WHEN others THEN
      RAISE EXCEPTION 'quiz addition failed. Check your inputs and try again: %', SQLERRM;
  END;
$block1$ LANGUAGE PLPGSQL;
END;
$block$ LANGUAGE PLPGSQL;
