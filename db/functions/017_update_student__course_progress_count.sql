DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for updating courses.progress.';

  CREATE OR REPLACE PROCEDURE update_progress_for_course (assessment_id_ UUID, student_id_ UUID, submitted_at_ TIMESTAMPTZ)
  LANGUAGE PLPGSQL AS
  $block2$
  DECLARE
    course_entry       RECORD;
    attempt_count         INT;
    quiz_count_           INT;
    retake_count         INT;
    precise_progress  NUMERIC;
  BEGIN

    SELECT courses.course_id
      FROM courseta.students__assessments
      JOIN courseta.quizzes ON (students__assessments.assessment_id = quizzes.quiz_id)
      JOIN courseta.lessons USING (lesson_id)
      JOIN courseta.courses USING (course_id)
      WHERE courseta.students__assessments.assessment_id = assessment_id_
      AND courseta.students__assessments.submitted_at = submitted_at_
    INTO course_entry;

    SELECT INTO attempt_count COUNT(*) FROM(
      SELECT students__assessments.assessment_id
      FROM courseta.quizzes
      JOIN courseta.students__assessments ON (students__assessments.assessment_id = quizzes.quiz_id)
      JOIN courseta.lessons USING (lesson_id)
      JOIN courseta.courses USING (course_id)
      WHERE courses.course_id = course_entry.course_id
      AND students__assessments.student_id = student_id_
      GROUP BY students__assessments.assessment_id
    ) AS RES2;

    SELECT INTO retake_count COUNT(*)
    FROM courseta.quizzes
    JOIN courseta.students__assessments ON (students__assessments.assessment_id = quizzes.quiz_id)
    JOIN courseta.lessons USING (lesson_id)
    JOIN courseta.courses USING (course_id)
    WHERE courses.course_id = course_entry.course_id
    AND students__assessments.student_id = student_id_
    AND students__assessments.submitted_at <> submitted_at_;

    SELECT INTO quiz_count_ courses.quiz_count
    FROM courseta.courses WHERE
    course_id = course_entry.course_id;

    RAISE NOTICE '[debug]: attempt count / quiz count: (%/%), retake count: (%)', attempt_count, quiz_count_, retake_count;

    CASE WHEN attempt_count = 0
    THEN precise_progress := 0;
    WHEN retake_count >= 1
    THEN precise_progress := 0;
    WHEN quiz_count_ IS NULL
    THEN precise_progress := 0;
    ELSE
      precise_progress := (attempt_count::NUMERIC / COALESCE(NULLIF(quiz_count_, 0), attempt_count)) * 100;
    END CASE;


    UPDATE courseta.students__courses SET progress = progress + precise_progress
    WHERE students__courses.course_id = course_entry.course_id;


  END;
  $block2$;

  CREATE OR REPLACE FUNCTION update_equiv_course_progress () RETURNS TRIGGER AS
  $block1$
    BEGIN
      IF NEW.waiting = OLD.waiting OR NEW.waiting = 'true' THEN
        RETURN NEW; -- don't do anything further if the assessment submission is not past the waiting state
      END IF;

      CALL update_progress_for_course(NEW.assessment_id, NEW.student_id, NEW.submitted_at);

      RETURN NEW;
    END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for updating courses.progress.';

END
$block$ LANGUAGE PLPGSQL;
