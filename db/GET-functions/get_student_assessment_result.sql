DO
$block$
BEGIN
RAISE NOTICE '[SETUP]   (GET) FUNCTION: setting up function that gets assessment results.';

  CREATE OR REPLACE FUNCTION get_student_assessment_results
  (student_id_ UUID)
  RETURNS JSONB AS
  $block2$
  DECLARE
    result    JSONB;
    quizzes_  JSONB;
    exams_    JSONB;
  BEGIN
    SELECT INTO quizzes_ json_agg(json_build_object(
      'status', qar.status,
      'dateAttempted', qar.attempted_at,
      'percentScore', qar.score,
      'quizID', q.quiz_id
    ))::JSONB quizzes
    FROM courseta.assessments_results qar
    JOIN courseta.quizzes q USING (assessment_id)
    WHERE qar.student_id = student_id_
    GROUP BY qar.student_id;

    SELECT INTO exams_ json_agg(json_build_object(
      'status', ear.status,
      'dateAttempted', ear.attempted_at,
      'percentScore', ear.score,
      'examID', e.exam_id
    ))::JSONB exams
    FROM courseta.assessments_results ear
    JOIN courseta.exams e USING (assessment_id)
    WHERE ear.student_id = student_id_
    GROUP BY ear.student_id;

    result := json_build_object('exams', exams_, 'quizzes', quizzes_);
    RETURN result;
  END;
  $block2$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]   (GET) FUNCTION: DONE setting up function that gets assessment results.';
END
$block$ LANGUAGE PLPGSQL;
