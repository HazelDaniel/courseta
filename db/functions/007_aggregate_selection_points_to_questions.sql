DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update on the students__questions.points_accumulated.';

  CREATE OR REPLACE FUNCTION agg_answer_submission_points_to_question () RETURNS TRIGGER AS
  $block1$
  DECLARE
    correct_answers_picked           SMALLINT;
    wrong_answers_picked             SMALLINT;
    answers_correct                  SMALLINT;
    tot_points                       SMALLINT;
  BEGIN
    SELECT INTO correct_answers_picked COUNT(*) FROM students__answers
    JOIN answers USING(answer_id) 
    WHERE selected_at = NEW.answered_at AND student_id = NEW.student_id AND
    question_id = NEW.question_id AND is_correct = 'true';

    SELECT INTO wrong_answers_picked COUNT(*) FROM students__answers
    JOIN answers USING(answer_id)
    WHERE selected_at = NEW.answered_at AND student_id = NEW.student_id AND
    question_id = NEW.question_id AND is_correct = 'false';

    SELECT INTO answers_correct COUNT(*) FROM answers WHERE question_id = NEW.question_id
    AND is_correct = 'true';

    tot_points := GREATEST((correct_answers_picked - wrong_answers_picked), 0) / answers_correct;
    NEW.points_accumulated = tot_points;

    RETURN NEW;
  END;
  $block1$ LANGUAGE PLPGSQL;

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update on the students__questions.points_accumulated.';
END
$block$ LANGUAGE PLPGSQL;