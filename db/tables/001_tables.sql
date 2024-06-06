DO
$block$
BEGIN
  DROP SCHEMA IF EXISTS courseta CASCADE;
  CREATE SCHEMA courseta;
  CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA courseta;
  ALTER DATABASE courseta SET search_path TO courseta;

  CREATE TYPE courseta.USER_ROLE_TYPE AS ENUM('student', 'creator');

  CREATE TABLE IF NOT EXISTS courseta.users (
    user_id BIGINT PRIMARY KEY,
    email VARCHAR(256),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role courseta.USER_ROLE_TYPE
  );

  CREATE TYPE courseta.RANK_TYPE AS ENUM('novice', 'amateur', 'senior', 'professional', 'master', 'legendary');

  CREATE TABLE IF NOT EXISTS courseta.students (
    student_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    xp_rank courseta.RANK_TYPE NOT NULL,
    user_id BIGINT NOT NULL,
    points SMALLINT NOT NULL DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES courseta.users(user_id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
    UNIQUE(user_id),
    CHECK (first_name IS NOT NULL),
    CHECK (last_name IS NOT NULL),
    CHECK (email IS NOT NULL),
    CHECK (role IS NOT NULL)
  ) INHERITS (courseta.users);

  CREATE TABLE IF NOT EXISTS courseta.creators (
    creator_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES courseta.users(user_id) ON DELETE CASCADE,
    UNIQUE(user_id),
    CHECK (first_name IS NOT NULL),
    CHECK (last_name IS NOT NULL),
    CHECK (email IS NOT NULL),
    CHECK (role IS NOT NULL)
  ) INHERITS (courseta.users);

  CREATE TABLE IF NOT EXISTS courseta.courses (
    course_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    lesson_count SMALLINT NOT NULL default 0,
    description TEXT NOT NULL,
    thumbnail TEXT,
    review_count INT NOT NULL DEFAULT 0,
    creator_id BIGINT NOT NULL,
    student_count INT NOT NULL DEFAULT 0,
    FOREIGN KEY(creator_id) REFERENCES courseta.creators(creator_id) ON DELETE CASCADE
  );

  CREATE TYPE courseta.REVIEW_RATING AS ENUM('1', '2', '3', '4', '5');

  CREATE TABLE IF NOT EXISTS courseta.reviews (
    review_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    review VARCHAR(250),
    rating courseta.REVIEW_RATING NOT NULL,
    course_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(course_id) REFERENCES courseta.courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY(student_id) REFERENCES courseta.students(student_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS courseta.lessons (
    lesson_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    course_id BIGINT NOT NULL,
    FOREIGN KEY(course_id) REFERENCES courseta.courses(course_id) ON DELETE CASCADE

  );

  CREATE TABLE IF NOT EXISTS courseta.lesson_contents (
    lesson_content_id BIGINT PRIMARY KEY, 
    title TEXT NOT NULL,
    href TEXT NOT NULL,
    lesson_id BIGINT NOT NULL,
    FOREIGN KEY(lesson_id) REFERENCES courseta.lessons(lesson_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS courseta.assessments (
    assessment_id UUID PRIMARY KEY,
    pass_mark SMALLINT,
    description VARCHAR(250),
    thumbnail TEXT,
    total_points INT DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS courseta.exams (
    exam_id UUID DEFAULT gen_random_uuid() PRIMARY KEY, 
    attempted BOOLEAN NOT NULL DEFAULT 'false',
    duration SMALLINT NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    assessment_id UUID NOT NULL,
    FOREIGN KEY (assessment_id) REFERENCES courseta.assessments(assessment_id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
    UNIQUE (assessment_id),
    CHECK (pass_mark IS NOT NULL),
    CHECK (description IS NOT NULL),
    CHECK (total_points IS NOT NULL)

  ) INHERITS (courseta.assessments);


  CREATE TABLE IF NOT EXISTS courseta.quizzes (
    quiz_id UUID DEFAULT gen_random_uuid() PRIMARY KEY, 
    lesson_id BIGINT NOT NULL,
    FOREIGN KEY (lesson_id) REFERENCES courseta.lessons(lesson_id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL,
    FOREIGN KEY (assessment_id) REFERENCES courseta.assessments(assessment_id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
    UNIQUE (assessment_id),
    CHECK (pass_mark IS NOT NULL),
    CHECK (description IS NOT NULL),
    CHECK (total_points IS NOT NULL)
  ) INHERITS (courseta.assessments);



  CREATE TABLE IF NOT EXISTS courseta.questions (
    question_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    question_text TEXT NOT NULL,
    points SMALLINT NOT NULL,
    assessment_id UUID NOT NULL,
    FOREIGN KEY (assessment_id) REFERENCES courseta.assessments(assessment_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS courseta.answers (
    answer_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    question_id BIGINT NOT NULL,
    FOREIGN KEY (question_id) REFERENCES courseta.questions(question_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS courseta.assessment_results (
    score SMALLINT NOT NULL,
    attempted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS courseta.exam_results (
    exam_result_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    exam_id UUID NOT NULL,
    FOREIGN KEY (exam_id) REFERENCES courseta.exams(exam_id) ON DELETE CASCADE
  ) INHERITS (courseta.assessment_results);

  CREATE TABLE IF NOT EXISTS courseta.quiz_results (
    quiz_result_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quiz_id UUID NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES courseta.quizzes(quiz_id) ON DELETE CASCADE
  ) INHERITS (courseta.assessment_results);

  CREATE TYPE courseta.AUDIENCE_TYPE AS ENUM ('public', 'creators', 'students');

  CREATE TABLE IF NOT EXISTS courseta.notifications (
    notification_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    targeted_at courseta.AUDIENCE_TYPE NOT NULL DEFAULT 'public',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS courseta.students__quizzes (
    student_id BIGINT NOT NULL,
    quiz_id UUID NOT NULL,
    FOREIGN KEY (student_id) REFERENCES courseta.students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES courseta.quizzes(quiz_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS courseta.students__exams (
    student_id BIGINT NOT NULL,
    exam_id UUID NOT NULL,
    attempted BOOLEAN NOT NULL DEFAULT 'false',
    FOREIGN KEY (student_id) REFERENCES courseta.students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES courseta.exams(exam_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS courseta.students__courses (
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES courseta.students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courseta.courses(course_id) ON DELETE CASCADE
  );

END;
$block$ LANGUAGE PLPGSQL