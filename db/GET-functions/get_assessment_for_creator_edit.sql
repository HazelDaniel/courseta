DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up the get_assessment_for_creator_edit function ...';

  CREATE OR REPLACE FUNCTION get_assessment_for_creator_edit (assessment_id_ UUID) RETURNS
  TABLE (
    parent_id BIGINT,
    assessment_type courseta.ASSESSMENT_TYPE
  ) AS
  $block1$
  BEGIN
    RETURN QUERY SELECT exams.course_id parent_id, exams.assessment_type
    FROM courseta.exams
    WHERE exams.exam_id = assessment_id_;

    IF NOT FOUND THEN
      RETURN QUERY SELECT quizzes.lesson_id parent_id, quizzes.assessment_type
      FROM courseta.quizzes
      WHERE quizzes.quiz_id = assessment_id_;
    END IF;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up the get_assessment_for_creator_edit function.';
END
$block$ LANGUAGE PLPGSQL;
