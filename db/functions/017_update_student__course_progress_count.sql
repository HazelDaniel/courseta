DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for updating courses.progress.';

  CREATE OR REPLACE FUNCTION update_equiv_course_progress () RETURNS TRIGGER AS
  $block1$
    BEGIN
      CALL update_progress_for_course(NEW.assessment_id, NEW.student_id, NEW.submitted_at);

      RETURN NEW;
    END;
  $block1$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE PROCEDURE update_progress_for_course (assessment_id UUID, student_id UUID, submitted_at TIMESTAMPTZ)
  LANGUAGE PLPGSQL AS
  $block2$
  DECLARE
    course_entry       RECORD;
    attempt_count      INT;
  BEGIN
    SELECT INTO course_entry course_id, quiz_count FROM (SELECT students__assessments.assessment_id, courses.course_id
    FROM courseta.students__assessments
    JOIN courseta.quizzes ON (students__assessments.assessment_id = quizzes.quiz_id)
    JOIN courseta.lessons USING (lesson_id)
    JOIN courseta.courses USING (course_id)
    WHERE courseta.students__assessments.assessment_id = assessment_id
    AND courseta.students__assessments.submitted_at = submitted_at) AS RES;

    SELECT INTO attempt_count COUNT(*) FROM(
      SELECT students__assessments.student_id, students__assessments.assesssment_id, lessons.lesson_id, courses.course_id
      FROM courseta.students__assessments
      JOIN courseta.quizzes ON (students__assessments.assessment_id = quizzes.quiz_id)
      JOIN courseta.lessons USING (lesson_id)
      JOIN courseta.courses USING (course_id)
      WHERE courses.course_id = course_entry.course_id
      AND students__assessments.student_id = student_id
      GROUP BY assessment_id
    ) AS RES2 WHERE RES2.course_id = course_entry.course_id;

    UPDATE courseta.students__courses SET progress = progress + (attempt_count / COALESCE(NULLIF (quiz_count, 0), attempt_count)) * 100 WHERE students__courses.course_id = course_entry.course_id;

  END;
  $block2$;

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for updating courses.progress.';

END
$block$ LANGUAGE PLPGSQL;