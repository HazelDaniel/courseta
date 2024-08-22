DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update on the students__questions.points_accumulated.';

  CREATE OR REPLACE FUNCTION p_02_agg_answer_submission_points () RETURNS TRIGGER AS
  $block1$
  DECLARE
    correct_answers_picked           SMALLINT;
    wrong_answers_picked             SMALLINT;
    answers_correct                  SMALLINT;
    tot_points                       SMALLINT;
    precise_tot_points                NUMERIC;
    question_points                  SMALLINT;
  BEGIN
    SELECT INTO correct_answers_picked COUNT(*) FROM students__answers
    JOIN answers USING(answer_id)
    WHERE students__answers.selected_at = NEW.selected_at
		AND students__answers.student_id = NEW.student_id
		AND answers.question_id = NEW.question_id
    AND answers.is_correct = 'true';

    SELECT INTO wrong_answers_picked COUNT(*) FROM students__answers
    JOIN answers USING(answer_id)
    WHERE students__answers.selected_at = NEW.selected_at
		AND students__answers.student_id = NEW.student_id
		AND answers.question_id = NEW.question_id
    AND answers.is_correct = 'false';

    SELECT INTO answers_correct COUNT(*) FROM answers
		WHERE answers.question_id = NEW.question_id
    AND answers.is_correct = 'true';

    SELECT INTO question_points questions.points
    FROM courseta.questions WHERE question_id = NEW.question_id;


    IF answers_correct <= 0 AND wrong_answers_picked > 0 THEN
    precise_tot_points := 0;
    ELSE
    precise_tot_points := ROUND((GREATEST((correct_answers_picked - wrong_answers_picked)::NUMERIC, 0) / answers_correct)::NUMERIC * question_points, 2);
    END IF;

    tot_points := precise_tot_points::INTEGER;

    UPDATE courseta.students__answers
    SET points_gained = tot_points
    WHERE students__answers.answer_id = NEW.answer_id
    AND students__answers.student_id = NEW.student_id
    AND students__answers.selected_at = NEW.selected_at;

    RETURN NEW;
  END;
  $block1$ LANGUAGE PLPGSQL;

  CREATE OR REPLACE FUNCTION p_02_agg_answer_submission_points_to_question () RETURNS TRIGGER AS
  $block1$
  DECLARE
    tot_points                       SMALLINT;
    question_points                  SMALLINT;
  BEGIN
    SELECT INTO tot_points COALESCE(SUM(points_gained), 0)
    FROM courseta.students__answers
    WHERE students__answers.question_id = NEW.question_id
    AND students__answers.student_id = NEW.student_id
    AND students__answers.selected_at = NEW.answered_at;

    UPDATE students__questions SET
    points_accumulated = tot_points
    WHERE students__questions.question_id = NEW.question_id
    AND students__questions.answered_at = NEW.answered_at;

    RETURN NEW;
  END;
  $block1$ LANGUAGE PLPGSQL;

RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update on the students__questions.points_accumulated.';
END
$block$ LANGUAGE PLPGSQL;
