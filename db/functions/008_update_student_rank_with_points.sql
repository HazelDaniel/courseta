DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: setting up procedures/functions for update of the student.rank.';

  CREATE OR REPLACE FUNCTION update_student_rank_with_points () RETURNS TRIGGER AS
  $block1$
  BEGIN
    IF NEW.points != OLD.points THEN
      CALL select_student_rank_update_with_points(NEW.points, NEW.student_id);
    END IF;
  END;
  $block1$ LANGUAGE PLPGSQL;


  CREATE OR REPLACE PROCEDURE select_student_rank_update_with_points
  (student_points INT, student_id UUID) LANGUAGE PLPGSQL AS
  $block2$
  BEGIN
    UPDATE students SET rank =
    (CASE
    WHEN student_points >= 0 AND student_points < 200 THEN 'novice'
    WHEN student_points >= 200 AND student_points < 1000 THEN 'amateur'
    WHEN student_points >= 1000 AND student_points < 10000 THEN 'senior'
    WHEN student_points >= 10000 AND student_points < 150000 THEN 'professional'
    WHEN student_points >= 150000 AND student_points < 3000000 THEN 'master'
    WHEN student_points >= 3000000 THEN 'legendary'
    END) WHERE student_id = student_id;
  END;
  $block2$;

  RAISE NOTICE '[SETUP]  PROCEDURE/FUNCTION: DONE setting up procedures/functions for update of the student.rank.';
END
$block$ LANGUAGE PLPGSQL;