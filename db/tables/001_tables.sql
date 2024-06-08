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
    user_id UUID NOT NULL PRIMARY KEY
  );

  CREATE TYPE courseta.RANK_TYPE AS ENUM('novice', 'amateur', 'senior', 'professional', 'master', 'legendary');
  -- rank_map {novice: 0, amateur: 200, senior: 1000, professional: 10000, master: 150000, legendary: 3000000}

  CREATE TABLE IF NOT EXISTS courseta.students (
    student_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    rank courseta.RANK_TYPE NOT NULL DEFAULT 'novice',
    points INT NOT NULL DEFAULT 0,
    email VARCHAR(256) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role courseta.USER_ROLE_TYPE NOT NULL DEFAULT 'student' CHECK (role = 'student')
  );

  CREATE TABLE IF NOT EXISTS courseta.creators (
    creator_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(256) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    course_review_count INT NOT NULL DEFAULT 0,
    role courseta.USER_ROLE_TYPE NOT NULL DEFAULT 'creator' CHECK (role = 'creator')
  );

  CREATE TABLE IF NOT EXISTS courseta.courses (
    course_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    lesson_count SMALLINT NOT NULL default 0,
    description TEXT NOT NULL DEFAULT 'no description provided',
    thumbnail TEXT,
    review_count INT NOT NULL DEFAULT 0,
    creator_id UUID NOT NULL,
    student_count INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CHECK (EXTRACT(EPOCH FROM updated_at) - EXTRACT(EPOCH FROM created_at) >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(creator_id) REFERENCES courseta.creators(creator_id) ON DELETE CASCADE
  );

  CREATE TYPE courseta.REVIEW_RATING AS ENUM('1', '2', '3', '4', '5');

  CREATE TABLE IF NOT EXISTS courseta.reviews (
    review_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    review_text VARCHAR(250),
    rating courseta.REVIEW_RATING NOT NULL,
    course_id BIGINT NOT NULL,
    student_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(course_id) REFERENCES courseta.courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY(student_id) REFERENCES courseta.students(student_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS courseta.assessments (
    assessment_id UUID PRIMARY KEY,
    pass_score SMALLINT NOT NULL,
    description VARCHAR(250),
    thumbnail TEXT,
    total_points INT DEFAULT 0,
    question_count SMALLINT DEFAULT 0,
    CHECK (pass_score < 100 AND pass_score > 0)
  );

  CREATE TABLE IF NOT EXISTS courseta.quizzes (
    quiz_id UUID DEFAULT gen_random_uuid() PRIMARY KEY, 
    CHECK (pass_score IS NOT NULL),
    CHECK (description IS NOT NULL),
    CHECK (total_points IS NOT NULL)
  ) INHERITS (courseta.assessments);

  CREATE TABLE IF NOT EXISTS courseta.lessons (
    lesson_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    course_id BIGINT NOT NULL,
    content_count SMALLINT NOT NULL DEFAULT 0,
    total_duration SMALLINT NOT NULL DEFAULT 0, -- TODO: make a trigger for this one
    quiz_id UUID, -- a lesson doesn't need to have a quiz
    FOREIGN KEY(quiz_id) REFERENCES courseta.quizzes(quiz_id) ON DELETE SET NULL,
    FOREIGN KEY(course_id) REFERENCES courseta.courses(course_id) ON DELETE CASCADE
  );

  CREATE TYPE courseta.LESSON_CONTENT_TYPE AS ENUM('video', 'text');

  CREATE TABLE IF NOT EXISTS courseta.lesson_contents (
    lesson_content_id BIGINT PRIMARY KEY, 
    title TEXT NOT NULL,
    href TEXT NOT NULL,
    lesson_id BIGINT NOT NULL,
    duration INT NOT NULL DEFAULT 600,
    FOREIGN KEY(lesson_id) REFERENCES courseta.lessons(lesson_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS courseta.exams (
    exam_id UUID DEFAULT gen_random_uuid() PRIMARY KEY, 
    duration SMALLINT NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    CHECK (pass_score IS NOT NULL),
    CHECK (description IS NOT NULL),
    CHECK (total_points IS NOT NULL),
    CHECK (EXTRACT(EPOCH FROM end_date) - EXTRACT(EPOCH FROM start_date) > 0)
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

  CREATE TABLE IF NOT EXISTS courseta.students__assessments (
    student_id UUID NOT NULL,
    assessment_id UUID NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_points_accumulated SMALLINT NOT NULL DEFAULT 0,
    PRIMARY KEY(student_id, assessment_id, submitted_at),
    FOREIGN KEY (student_id) REFERENCES courseta.students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (assessment_id) REFERENCES courseta.assessments(assessment_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS courseta.assessments_results (
    assessment_result_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    score SMALLINT NOT NULL,
    attempted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    student_id UUID NOT NULL,
    assessment_id UUID NOT NULL,
    UNIQUE (attempted_at),
    FOREIGN KEY(student_id, assessment_id, attempted_at) REFERENCES courseta.students__assessments(student_id, assessment_id, submitted_at) ON DELETE CASCADE
  );

  CREATE TYPE courseta.AUDIENCE_TYPE AS ENUM ('public', 'creators', 'students');

  CREATE TABLE IF NOT EXISTS courseta.notifications (
    notification_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    targeted_at courseta.AUDIENCE_TYPE NOT NULL DEFAULT 'public',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS courseta.students__exams (
    student_id UUID NOT NULL,
    exam_id UUID NOT NULL,
    PRIMARY KEY(student_id, exam_id),
    FOREIGN KEY (student_id) REFERENCES courseta.students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES courseta.exams(exam_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS courseta.students__courses (
    student_id UUID NOT NULL,
    course_id BIGINT NOT NULL,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES courseta.students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courseta.courses(course_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS courseta.students__questions (
    student_id UUID NOT NULL,
    question_id BIGINT NOT NULL,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    points_accumulated SMALLINT NOT NULL DEFAULT 0,
    PRIMARY KEY (student_id, question_id),
    FOREIGN KEY (student_id) REFERENCES courseta.students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES courseta.questions(question_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS courseta.students__answers (
    student_id UUID NOT NULL,
    answer_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    selected_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id, question_id) REFERENCES courseta.students__questions(student_id, question_id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES courseta.answers(answer_id) ON DELETE CASCADE
  );

  RAISE NOTICE '[SETUP]  TABLE: DONE creating tables.';

END;
$block$ LANGUAGE PLPGSQL