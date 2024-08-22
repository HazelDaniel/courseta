DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for updating courses.progress.';

  CREATE OR REPLACE PROCEDURE p_01_update_course_progress_from_assessment (assessment_id_ UUID, student_id_ UUID, submitted_at_ TIMESTAMPTZ)
  LANGUAGE PLPGSQL AS
  $block2$
  DECLARE
    equiv_course_id       INT;
    attempt_count         INT;
    quiz_count_            INT;
    precise_progress  NUMERIC;
  BEGIN
    SELECT INTO equiv_course_id courses.course_id
    FROM courseta.courses
    JOIN courseta.lessons USING (course_id)
    JOIN courseta.quizzes USING (lesson_id)
    JOIN courseta.students__assessments USING (assessment_id)
    WHERE courseta.students__assessments.assessment_id = assessment_id_
    AND courseta.students__assessments.student_id = student_id_ -- not needed but we are using the index for perf
    AND courseta.students__assessments.submitted_at = submitted_at_;

    SELECT INTO attempt_count COUNT(*)
    FROM (
      SELECT quizzes.assessment_id FROM
      courseta.students__assessments
      JOIN courseta.quizzes USING (assessment_id)
      JOIN courseta.lessons USING (lesson_id)
      JOIN courseta.courses USING (course_id)
      WHERE courses.course_id = equiv_course_id
      AND students__assessments.student_id = student_id_
      GROUP BY quizzes.assessment_id
    ) RES;


    SELECT INTO quiz_count_ courses.quiz_count
    FROM courseta.courses WHERE
    course_id = equiv_course_id;

    RAISE NOTICE '[debug]: attempt count / quiz count: (%/%). where equiv course id is %', attempt_count, quiz_count_, equiv_course_id;
    RAISE NOTICE '[debug]: assessment id is %', assessment_id_;

    CASE WHEN attempt_count = 0
    THEN precise_progress := 0;
    WHEN quiz_count_ IS NULL
    THEN precise_progress := 0;
    ELSE
      precise_progress := (attempt_count::NUMERIC / COALESCE(NULLIF(quiz_count_, 0), attempt_count)) * 100;
    END CASE;


    UPDATE courseta.students__courses SET progress = precise_progress
    WHERE students__courses.course_id = equiv_course_id
    AND students__courses.student_id = student_id_;
  END;
  $block2$;



CREATE OR REPLACE PROCEDURE p_01_deduct_course_progress_from_assessment  (assessment_id_ UUID, student_id_ UUID, submitted_at_ TIMESTAMPTZ)
LANGUAGE PLPGSQL AS
$block2$
DECLARE
  equiv_course_id          INT;
  new_quiz_count           INT;
  last_attempt          RECORD;
  new_attempt_count        INT;
  precise_progress     NUMERIC;
BEGIN
  SELECT INTO last_attempt se.submitted_at, se.assessment_id
  FROM students__assessments se
  WHERE se.assessment_id = assessment_id_
  AND se.student_id = student_id_
  ORDER BY submitted_at DESC;

  IF last_attempt.submitted_at <> submitted_at_ OR last_attempt.assessment_id <> assessment_id_ THEN
    RETURN; -- we are basically working with last submissions of all quizzes
  END IF;

  SELECT INTO equiv_course_id courses.course_id
  FROM courseta.students__assessments
  JOIN courseta.quizzes USING (assessment_id)
  JOIN courseta.lessons USING (lesson_id)
  JOIN courseta.courses USING (course_id)
  WHERE courseta.students__assessments.assessment_id = assessment_id_
  AND courseta.students__assessments.student_id = student_id_ -- not needed but we are using the index for perf
  AND courseta.students__assessments.submitted_at = submitted_at_;

  RAISE NOTICE 'this runs at most once for each quiz attempted';
  RAISE NOTICE '[debug]: input assessment id is %', assessment_id_;
  RAISE NOTICE '[debug]: the equiv course id is %', equiv_course_id;


  SELECT INTO new_quiz_count COUNT(*)
  FROM courseta.quizzes
  JOIN courseta.lessons USING (lesson_id)
  JOIN courseta.courses USING (course_id)
  WHERE courses.course_id = equiv_course_id
  AND quizzes.quiz_id <> assessment_id_;

  SELECT INTO new_attempt_count COUNT(*)
  FROM (
    SELECT quizzes.assessment_id FROM
    courseta.students__assessments
    JOIN courseta.quizzes USING (assessment_id)
    JOIN courseta.lessons USING (lesson_id)
    JOIN courseta.courses USING (course_id)
    WHERE courses.course_id = equiv_course_id
    AND students__assessments.student_id = student_id_
    AND students__assessments.assessment_id <> assessment_id_
    GROUP BY quizzes.assessment_id
  ) RES;

  RAISE NOTICE 'quiz count should be decremented';
  RAISE NOTICE '[debug]: attempt count / quiz_count : (%/%)', new_attempt_count, new_quiz_count;

  CASE WHEN new_quiz_count = 0 OR new_attempt_count = 0 THEN
  precise_progress := 0;
  ELSE
    precise_progress := (new_attempt_count::NUMERIC / COALESCE(NULLIF(new_quiz_count, 0), new_attempt_count)) * 100;
  END CASE;

  RAISE NOTICE 'precise progress = %, and the course id is %, and the student id is %', precise_progress, equiv_course_id, student_id_;

  UPDATE courseta.students__courses SET progress = precise_progress
  WHERE students__courses.course_id = equiv_course_id
  AND students__courses.student_id = student_id_;
END;
$block2$;

RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for updating courses.progress.';
END
$block$ LANGUAGE PLPGSQL;
