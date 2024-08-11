export interface LessonInputType {
  title: string;
  contentCount: number;
  quizCount: number;
}

export interface LessonsLessonContentInputType {
  title: string;
  href: string;
  contentType: string;
  duration: number;
}

export interface LessonsQuizInputType {
  quizTitle: string;
  description: string;
  passScore: number;
  totalPoints: number;
}

export interface AssessmentInputType {
  parentEntityID?: number;
  passScore: number;
  description: string;
  quizTitle?: string;
  duration?: number;
  startDate?: string;
  endDate?: string;
}

export interface QuestionInputType {
  questionText: string;
  points: number;
  positionID?: number;
  answerCount: number;
}

export interface AnswerInputType {
  answerText: string;
  isCorrect: string;
}