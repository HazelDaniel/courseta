DO
$block$
BEGIN
  RAISE NOTICE '[SETUP]  TABLE: creating tables ...';
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
    role courseta.USER_ROLE_TYPE DEFAULT 'student'
  );

  CREATE TYPE courseta.RANK_TYPE AS ENUM('novice', 'amateur', 'senior', 'professional', 'master', 'legendary');

  CREATE TABLE IF NOT EXISTS courseta.students (
    student_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rank courseta.RANK_TYPE NOT NULL DEFAULT 'novice',
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
    FOREIGN KEY(user_id) REFERENCES courseta.users(user_id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
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
    description TEXT NOT NULL DEFAULT 'no description provided',
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
    pass_score SMALLINT,
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
    CHECK (pass_score IS NOT NULL),
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
    CHECK (pass_score IS NOT NULL),
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
    assessment_result_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    score SMALLINT NOT NULL,
    attempted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    assessment_id UUID NOT NULL,
    FOREIGN KEY(assessment_id) REFERENCES courseta.assessments(assessment_id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL,
    FOREIGN KEY(student_id) REFERENCES courseta.students(student_id) ON DELETE CASCADE
  );

  CREATE TYPE courseta.AUDIENCE_TYPE AS ENUM ('public', 'creators', 'students');

  CREATE TABLE IF NOT EXISTS courseta.notifications (
    notification_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    targeted_at courseta.AUDIENCE_TYPE NOT NULL DEFAULT 'public',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS courseta.students__assessments (
    student_id BIGINT,
    assessment_id UUID,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_points SMALLINT NOT NULL DEFAULT 0,
    PRIMARY KEY(student_id, assessment_id, submitted_at),
    FOREIGN KEY (student_id) REFERENCES courseta.students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (assessment_id) REFERENCES courseta.assessments(assessment_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS courseta.students__courses (
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES courseta.students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courseta.courses(course_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS courseta.students__questions (
    student_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    points_accumulated SMALLINT NOT NULL DEFAULT 0,
    PRIMARY KEY (student_id, question_id),
    FOREIGN KEY (student_id) REFERENCES courseta.students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES courseta.questions(question_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS courseta.students__answers (
    student_id BIGINT NOT NULL,
    answer_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    selected_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id, question_id) REFERENCES courseta.students__questions(student_id, question_id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES courseta.answers(answer_id) ON DELETE CASCADE
  );

  RAISE NOTICE '[SETUP]  TABLE: DONE creating tables.';

END;
$block$ LANGUAGE PLPGSQL