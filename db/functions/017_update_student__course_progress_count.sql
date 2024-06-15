DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for updating courses.progress.';

  CREATE OR REPLACE FUNCTION update_equiv_course_progress () RETURNS TRIGGER AS
  $block1$
    BEGIN
      IF NEW.waiting = OLD.waiting THEN
        RETURN NEW; -- dont do anything further if this is not a true assessment submission
      END IF;

      CALL update_progress_for_course(NEW.assessment_id, NEW.student_id, NEW.submitted_at);

      RETURN NEW;
    END;
  $block1$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE PROCEDURE update_progress_for_course (assessment_id_ UUID, student_id_ UUID, submitted_at_ TIMESTAMPTZ)
  LANGUAGE PLPGSQL AS
  $block2$
  DECLARE
    course_entry       RECORD;
    attempt_count         INT;
    quiz_count_           INT;
    precise_progress            NUMERIC;
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

    SELECT INTO quiz_count_ courses.quiz_count
    FROM courseta.courses WHERE
    course_id = course_entry.course_id;

    precise_progress := (attempt_count::NUMERIC / COALESCE(NULLIF(quiz_count_, 0), attempt_count)) * 100;


    UPDATE courseta.students__courses SET progress = progress + precise_progress
    WHERE students__courses.course_id = course_entry.course_id;


  END;
  $block2$;

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for updating courses.progress.';

END
$block$ LANGUAGE PLPGSQL;